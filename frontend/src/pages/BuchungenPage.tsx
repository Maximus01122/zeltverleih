import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  CalendarDays,
  Eye,
  FileText,
  List,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Receipt,
  Trash2,
  RefreshCw,
} from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CalendarView } from '@/components/booking/CalendarView'
import { OfferDialog } from '@/components/booking/OfferDialog'
import { InvoiceDialog } from '@/components/booking/InvoiceDialog'
import { StatusDialog } from '@/components/booking/StatusDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { deleteBooking, listBookings } from '@/lib/endpoints'
import { formatDate } from '@/lib/format'
import { INVOICEABLE } from '@/lib/status'
import { ApiError } from '@/lib/api'
import type { BookingSummary } from '@/lib/types'

type DialogState =
  | { type: 'offer' | 'invoice' | 'status' | 'delete'; booking: BookingSummary }
  | null

export function BuchungenPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [view, setView] = useState<'table' | 'calendar'>('table')
  const [dialog, setDialog] = useState<DialogState>(null)

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', from, to],
    queryFn: () => listBookings(from || undefined, to || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => {
      toast.success('Buchung gelöscht.')
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setDialog(null)
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Löschen fehlgeschlagen.'),
  })

  return (
    <div>
      <PageHeader
        title="Buchungsübersicht"
        description="Alle Buchungen im Überblick."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md border p-0.5">
              <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('table')}
              >
                <List className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Tabelle</span>
              </Button>
              <Button
                variant={view === 'calendar' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('calendar')}
              >
                <CalendarDays className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Kalender</span>
              </Button>
            </div>
            <Button onClick={() => navigate('/buchungen/neu')} className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" />
              Neue Buchung
            </Button>
          </div>
        }
      />

      {view === 'calendar' ? (
        <CalendarView onSelect={(id) => navigate(`/buchungen/${id}`)} />
      ) : (
        <>
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="from">Von</Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">Bis</Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setFrom('')
              setTo('')
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Zurücksetzen
          </Button>
        </div>
      </Card>

      <Card>
        <div className="space-y-3 p-4 md:hidden">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">Lädt…</p>
          ) : bookings && bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b.id}
                className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent/50"
                onClick={() => navigate(`/buchungen/${b.id}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 font-medium">{b.clientName}</div>
                  <StatusBadge status={b.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Start</dt>
                    <dd>{formatDate(b.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Ende</dt>
                    <dd>{formatDate(b.endDate)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Angebot</dt>
                    <dd>{formatDate(b.offerDate)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Aktionen">
                        <MoreHorizontal className="h-4 w-4" />
                        Aktionen
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/buchungen/${b.id}`)}>
                        <Eye className="h-4 w-4" />
                        Einzelansicht
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDialog({ type: 'offer', booking: b })}>
                        <FileText className="h-4 w-4" />
                        Angebot erstellen
                      </DropdownMenuItem>
                      {INVOICEABLE.includes(b.status) ? (
                        <DropdownMenuItem onClick={() => setDialog({ type: 'invoice', booking: b })}>
                          <Receipt className="h-4 w-4" />
                          Rechnung erstellen
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => navigate(`/buchungen/${b.id}/bearbeiten`)}
                      >
                        <Pencil className="h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDialog({ type: 'status', booking: b })}>
                        <RefreshCw className="h-4 w-4" />
                        Status ändern
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDialog({ type: 'delete', booking: b })}
                      >
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">Keine Buchungen gefunden.</p>
          )}
        </div>
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Kunde</TableHead>
              <TableHead>Startdatum</TableHead>
              <TableHead>Enddatum</TableHead>
              <TableHead>Angebotsdatum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Lädt…
                </TableCell>
              </TableRow>
            ) : bookings && bookings.length > 0 ? (
              bookings.map((b) => (
                <TableRow
                  key={b.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/buchungen/${b.id}`)}
                >
                  <TableCell className="font-medium">{b.clientName}</TableCell>
                  <TableCell>{formatDate(b.startDate)}</TableCell>
                  <TableCell>{formatDate(b.endDate)}</TableCell>
                  <TableCell>{formatDate(b.offerDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Aktionen">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/buchungen/${b.id}`)}>
                          <Eye className="h-4 w-4" />
                          Einzelansicht
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDialog({ type: 'offer', booking: b })}>
                          <FileText className="h-4 w-4" />
                          Angebot erstellen
                        </DropdownMenuItem>
                        {INVOICEABLE.includes(b.status) ? (
                          <DropdownMenuItem onClick={() => setDialog({ type: 'invoice', booking: b })}>
                            <Receipt className="h-4 w-4" />
                            Rechnung erstellen
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                          onClick={() => navigate(`/buchungen/${b.id}/bearbeiten`)}
                        >
                          <Pencil className="h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDialog({ type: 'status', booking: b })}>
                          <RefreshCw className="h-4 w-4" />
                          Status ändern
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDialog({ type: 'delete', booking: b })}
                        >
                          <Trash2 className="h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Keine Buchungen gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
        </>
      )}

      {dialog?.type === 'offer' ? (
        <OfferDialog
          bookingId={dialog.booking.id}
          open
          onOpenChange={(o) => !o && setDialog(null)}
        />
      ) : null}
      {dialog?.type === 'invoice' ? (
        <InvoiceDialog
          bookingId={dialog.booking.id}
          open
          onOpenChange={(o) => !o && setDialog(null)}
        />
      ) : null}
      {dialog?.type === 'status' ? (
        <StatusDialog
          bookingId={dialog.booking.id}
          current={dialog.booking.status}
          open
          onOpenChange={(o) => !o && setDialog(null)}
        />
      ) : null}
      {dialog?.type === 'delete' ? (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDialog(null)}
          title="Buchung löschen?"
          description={`Die Buchung von ${dialog.booking.clientName} wird unwiderruflich gelöscht.`}
          confirmLabel="Löschen"
          destructive
          busy={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(dialog.booking.id)}
        />
      ) : null}
    </div>
  )
}
