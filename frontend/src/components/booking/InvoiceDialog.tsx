import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ItemsEditor,
  toDocumentItems,
  type EditorItem,
} from '@/components/documents/ItemsEditor'
import { createInvoice, getBooking, invoiceFormDefaults, invoicePreview } from '@/lib/endpoints'
import { openPdf, ApiError } from '@/lib/api'
import { computeInvoiceDueDate, isoLocalDate } from '@/lib/format'

export function InvoiceDialog({
  bookingId,
  open,
  onOpenChange,
}: {
  bookingId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [invoiceDate, setInvoiceDate] = useState(isoLocalDate())
  const [serviceDate, setServiceDate] = useState('')
  const [dueDate, setDueDate] = useState(computeInvoiceDueDate(isoLocalDate()))
  const [customerNumber, setCustomerNumber] = useState('')
  const [items, setItems] = useState<EditorItem[]>([])
  const [busy, setBusy] = useState(false)

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled: open,
  })

  const { data: formDefaults } = useQuery({
    queryKey: ['invoice-defaults', bookingId],
    queryFn: () => invoiceFormDefaults(bookingId),
    enabled: open,
  })

  useQuery({
    queryKey: ['invoice-preview', bookingId],
    queryFn: async () => {
      const preview = await invoicePreview(bookingId)
      setItems(
        preview.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      )
      return preview
    },
    enabled: open,
  })

  useEffect(() => {
    if (!open || !booking || !formDefaults) return
    const today = isoLocalDate()
    setInvoiceDate(today)
    setServiceDate(booking.startDate)
    setDueDate(computeInvoiceDueDate(today))
    setCustomerNumber(String(formDefaults.customerNumber))
    setStep(1)
  }, [open, booking, formDefaults])

  const reset = () => {
    setStep(1)
    setItems([])
  }

  const onInvoiceDateChange = (value: string) => {
    setInvoiceDate(value)
    if (value) {
      setDueDate(computeInvoiceDueDate(value))
    }
  }

  const create = async () => {
    const parsedCustomerNumber = Number(customerNumber)
    if (!Number.isInteger(parsedCustomerNumber) || parsedCustomerNumber < 1) {
      toast.error('Bitte eine gültige Kundennummer eingeben.')
      return
    }
    setBusy(true)
    try {
      const invoice = await createInvoice(bookingId, {
        customerNumber: parsedCustomerNumber,
        invoiceDate,
        serviceDate,
        dueDate,
        items: toDocumentItems(items),
      })
      toast.success(`Rechnung ${invoice.invoiceNumber} erstellt.`)
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      await openPdf(`/api/bookings/${bookingId}/invoice/pdf`, 'GET')
      onOpenChange(false)
      reset()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Rechnung konnte nicht erstellt werden.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) reset()
      }}
    >
      <DialogContent className={step === 2 ? 'max-w-3xl' : 'max-w-md'}>
        <DialogHeader>
          <DialogTitle>
            Rechnung erstellen {step === 2 ? '· Positionen prüfen' : '· Daten'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerNumber">Kundennummer</Label>
              <Input
                id="customerNumber"
                type="number"
                min={1}
                step={1}
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoiceDate">Rechnungsdatum</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => onInvoiceDateChange(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serviceDate">Leistungsdatum</Label>
              <Input
                id="serviceDate"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <ItemsEditor items={items} onChange={setItems} />
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button onClick={() => setStep(2)}>Weiter</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)} disabled={busy}>
                Zurück
              </Button>
              <Button onClick={create} disabled={busy || items.length === 0}>
                {busy ? 'Erstelle…' : 'Rechnung erstellen'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
