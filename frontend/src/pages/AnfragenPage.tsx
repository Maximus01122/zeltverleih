import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarPlus, Mail, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteQuoteRequest, listQuoteRequests, setQuoteProcessed } from '@/lib/endpoints'
import { quoteMaterialQuantities } from '@/lib/quoteMaterials'
import { formatDate, formatDateTime } from '@/lib/format'
import { ApiError } from '@/lib/api'
import type { QuoteRequest } from '@/lib/types'

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string | null | undefined
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1 py-1 text-sm sm:flex-row sm:gap-3 ${className ?? ''}`}>
      <span className="shrink-0 font-medium text-muted-foreground sm:w-[10.5rem]">{label}</span>
      <span className="min-w-0 flex-1 break-words">{value || '–'}</span>
    </div>
  )
}

export function AnfragenPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<QuoteRequest | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null)

  const createBookingFromQuote = (quote: QuoteRequest) => {
    const eventDate = quote.eventDate ?? ''
    navigate('/buchungen/neu', {
      state: {
        fromQuote: {
          quoteId: quote.id,
          name: quote.name,
          email: quote.email ?? '',
          phoneNumber: quote.phone ?? '',
          postalCode: quote.deliveryPostalCode ?? '',
          city: quote.deliveryCity ?? '',
          startDate: eventDate,
          endDate: eventDate,
          materials: quoteMaterialQuantities(quote),
        },
      },
    })
  }

  const { data: requests, isLoading, isError, error } = useQuery({
    queryKey: ['anfragen'],
    queryFn: listQuoteRequests,
  })

  const toggle = useMutation({
    mutationFn: ({ id, processed }: { id: number; processed: boolean }) =>
      setQuoteProcessed(id, processed),
    onSuccess: (updated) => {
      toast.success(updated.processed ? 'Als bearbeitet markiert.' : 'Als offen markiert.')
      queryClient.invalidateQueries({ queryKey: ['anfragen'] })
      setSelected(updated)
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Aktualisierung fehlgeschlagen.'),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteQuoteRequest(id),
    onSuccess: () => {
      toast.success('Anfrage gelöscht.')
      queryClient.invalidateQueries({ queryKey: ['anfragen'] })
      setDeleteTarget(null)
      setSelected(null)
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Löschen fehlgeschlagen.'),
  })

  return (
    <div>
      <PageHeader
        title="Anfragen"
        description="Eingehende Nachrichten vom Kontaktformular der Website."
      />

      <Card>
        <div className="space-y-3 p-4 md:hidden">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">Lädt…</p>
          ) : isError ? (
            <p className="py-10 text-center text-destructive">
              {error instanceof ApiError ? error.message : 'Anfragen konnten nicht geladen werden.'}
            </p>
          ) : requests && requests.length > 0 ? (
            requests.map((r) => (
              <div
                key={r.id}
                className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent/50"
                onClick={() => setSelected(r)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 font-medium">{r.name}</div>
                  {r.processed ? (
                    <Badge variant="secondary">Bearbeitet</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800" variant="outline">
                      Offen
                    </Badge>
                  )}
                </div>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Eingang</dt>
                    <dd>{formatDateTime(r.receivedAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Typ</dt>
                    <dd className="text-right">{r.eventType || '–'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Wunschdatum</dt>
                    <dd>{formatDate(r.eventDate)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Zeltgröße</dt>
                    <dd>{r.tentSize || '–'}</dd>
                  </div>
                </dl>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">Keine Anfragen vorhanden.</p>
          )}
        </div>
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Eingang</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Veranstaltungstyp</TableHead>
              <TableHead>Wunschdatum</TableHead>
              <TableHead>Zeltgröße</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Lädt…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-destructive">
                  {error instanceof ApiError ? error.message : 'Anfragen konnten nicht geladen werden.'}
                </TableCell>
              </TableRow>
            ) : requests && requests.length > 0 ? (
              requests.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell>{formatDateTime(r.receivedAt)}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.eventType || '–'}</TableCell>
                  <TableCell>{formatDate(r.eventDate)}</TableCell>
                  <TableCell>{r.tentSize || '–'}</TableCell>
                  <TableCell>
                    {r.processed ? (
                      <Badge variant="secondary">Bearbeitet</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800" variant="outline">
                        Offen
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Keine Anfragen vorhanden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={selected != null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl gap-3 p-5 sm:p-6">
          {selected ? (
            <>
              <DialogHeader className="pb-1">
                <DialogTitle>Anfrage von {selected.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-x-10 sm:grid-cols-2">
                <DetailRow label="Eingang" value={formatDateTime(selected.receivedAt)} />
                <DetailRow label="E-Mail" value={selected.email} />
                <DetailRow label="Telefon" value={selected.phone} />
                <DetailRow label="Veranstaltungstyp" value={selected.eventType} />
                <DetailRow label="Wunschdatum" value={formatDate(selected.eventDate)} />
                <DetailRow label="Gästeanzahl" value={selected.guestCount} />
                <DetailRow label="Zeltanzahl" value={selected.tentCount} />
                <DetailRow label="Zeltgröße" value={selected.tentSize} />
                <DetailRow
                  label="Lieferort"
                  value={[selected.deliveryPostalCode, selected.deliveryCity]
                    .filter(Boolean)
                    .join(' ')}
                />
                <DetailRow label="Untergrund" value={selected.ground} />
                <DetailRow
                  label="Servicepaket"
                  value={selected.servicePackage}
                  className="sm:col-span-2"
                />
                <DetailRow
                  label="Zubehör"
                  value={selected.accessories}
                  className="sm:col-span-2"
                />
                <DetailRow
                  label="Nachricht"
                  value={selected.message}
                  className="sm:col-span-2"
                />
              </div>
              <DialogFooter className="mt-2 flex flex-wrap gap-2 border-t pt-4 sm:justify-start">
                {selected.email ? (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${selected.email}`}>
                      <Mail className="h-4 w-4" />
                      E-Mail schreiben
                    </a>
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  onClick={() =>
                    toggle.mutate({ id: selected.id, processed: !selected.processed })
                  }
                  disabled={toggle.isPending}
                >
                  {selected.processed ? 'Als offen markieren' : 'Als bearbeitet markieren'}
                </Button>
                <Button onClick={() => createBookingFromQuote(selected)}>
                  <CalendarPlus className="h-4 w-4" />
                  Buchung anlegen
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteTarget(selected)}
                  disabled={remove.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {deleteTarget ? (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDeleteTarget(null)}
          title="Anfrage löschen?"
          description={`Die Anfrage von ${deleteTarget.name} wird unwiderruflich gelöscht.`}
          confirmLabel="Löschen"
          destructive
          busy={remove.isPending}
          onConfirm={() => remove.mutate(deleteTarget.id)}
        />
      ) : null}
    </div>
  )
}
