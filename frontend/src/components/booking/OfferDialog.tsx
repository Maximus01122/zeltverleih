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
import { getBooking, listDeliveryFees, offerPreview } from '@/lib/endpoints'
import { openPdf, ApiError } from '@/lib/api'
import type { OfferConditions } from '@/lib/types'

export function OfferDialog({
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
  const [dailyRent, setDailyRent] = useState('0')
  const [weekendRent, setWeekendRent] = useState('1')
  const [deliveryCosts, setDeliveryCosts] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [items, setItems] = useState<EditorItem[]>([])
  const [busy, setBusy] = useState(false)

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled: open,
  })

  const { data: deliveryFees } = useQuery({
    queryKey: ['delivery-fees'],
    queryFn: listDeliveryFees,
    enabled: open,
  })

  const hasDelivery = booking?.services.includes('LIEFERUNG') ?? false

  useEffect(() => {
    if (!open || !booking) return

    setDailyRent(booking.countDailyRent != null ? String(booking.countDailyRent) : '0')
    setWeekendRent(booking.countWeekendRent != null ? String(booking.countWeekendRent) : '1')

    if (booking.deliveryCosts != null) {
      setDeliveryCosts(String(booking.deliveryCosts))
    } else {
      const defaultFee = deliveryFees?.[0]
      setDeliveryCosts(defaultFee ? String(defaultFee.price) : '')
    }

    setValidUntil(booking.validUntil ?? '')
    setStep(1)
    setItems([])
  }, [open, booking, deliveryFees])

  const reset = () => {
    setStep(1)
    setItems([])
  }

  const conditions = (): OfferConditions => ({
    countDailyRent: Number(dailyRent),
    countWeekendRent: Number(weekendRent),
    deliveryCosts: hasDelivery ? Number(deliveryCosts) : null,
    validUntil,
  })

  const loadPreview = async () => {
    if (!validUntil) {
      toast.error('Bitte ein Gültigkeitsdatum wählen.')
      return
    }
    setBusy(true)
    try {
      const preview = await offerPreview(bookingId, conditions())
      setItems(
        preview.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      )
      setStep(2)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Vorschau fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const generate = async () => {
    setBusy(true)
    try {
      await openPdf(`/api/bookings/${bookingId}/offer/pdf`, 'POST', {
        conditions: conditions(),
        items: toDocumentItems(items),
      })
      toast.success('Angebot als PDF erstellt.')
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      onOpenChange(false)
      reset()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'PDF konnte nicht erstellt werden.')
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
            Angebot erstellen {step === 2 ? '· Positionen prüfen' : ''}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="daily">Anzahl Tagesmieten</Label>
                <Input
                  id="daily"
                  type="number"
                  min={0}
                  value={dailyRent}
                  onChange={(e) => setDailyRent(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weekend">Anzahl Wochenendmieten</Label>
                <Input
                  id="weekend"
                  type="number"
                  min={0}
                  value={weekendRent}
                  onChange={(e) => setWeekendRent(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delivery">Lieferpauschale</Label>
              <Input
                id="delivery"
                type="number"
                min={0}
                step="0.01"
                value={deliveryCosts}
                onChange={(e) => setDeliveryCosts(e.target.value)}
                disabled={!hasDelivery}
              />
              {!hasDelivery ? (
                <p className="text-xs text-muted-foreground">
                  Nur editierbar, wenn der Service „Lieferung" gebucht ist.
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validUntil">Angebot gültig bis</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <ItemsEditor items={items} onChange={setItems} />
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button onClick={loadPreview} disabled={busy}>
              {busy ? 'Berechne…' : 'Weiter'}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)} disabled={busy}>
                Zurück
              </Button>
              <Button onClick={generate} disabled={busy || items.length === 0}>
                {busy ? 'Erstelle…' : 'Angebot erstellen'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
