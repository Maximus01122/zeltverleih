import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Pencil } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getBooking, listServices } from '@/lib/endpoints'
import { formatCurrency, formatDate } from '@/lib/format'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value || '–'}</div>
    </div>
  )
}

export function BuchungDetailPage() {
  const { id } = useParams()
  const bookingId = Number(id)
  const navigate = useNavigate()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
  })

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: listServices,
  })

  const serviceLabel = (name: string) =>
    services?.find((s) => s.name === name)?.label ?? name

  if (isLoading || !booking) {
    return <p className="text-muted-foreground">Lädt…</p>
  }

  const c = booking.client
  const address = [
    [c.street, c.houseNumber].filter(Boolean).join(' '),
    [c.postalCode, c.city].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div>
      <PageHeader
        title={`Buchung · ${c.name}`}
        description={`Kundennummer ${c.customerNumber}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/buchungen')} className="flex-1 sm:flex-none">
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
            <Button onClick={() => navigate(`/buchungen/${bookingId}/bearbeiten`)} className="flex-1 sm:flex-none">
              <Pencil className="h-4 w-4" />
              Bearbeiten
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kundeninformationen</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" value={c.name} />
            <Field label="E-Mail" value={c.email} />
            <Field label="Telefon" value={c.phoneNumber ?? '–'} />
            <Field label="Adresse" value={address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mietdauer</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Startdatum" value={formatDate(booking.startDate)} />
            <Field label="Enddatum" value={formatDate(booking.endDate)} />
            <Field label="Angebotsdatum" value={formatDate(booking.offerDate)} />
            <Field label="Gültig bis" value={formatDate(booking.validUntil)} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bestellung</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Menge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booking.materials.map((m) => (
                  <TableRow key={m.materialId}>
                    <TableCell>{m.materialName}</TableCell>
                    <TableCell className="text-right tabular-nums">{m.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {booking.loadingFee ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Ladepauschale: {booking.loadingFee.name} ·{' '}
                {formatCurrency(booking.loadingFee.price)}
              </p>
            ) : null}
            {booking.deliveryCosts ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Lieferpauschale: {formatCurrency(booking.deliveryCosts)}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent>
            {booking.services.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {booking.services.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {serviceLabel(s)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keine Services gewählt.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kommentar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">
              {booking.comment || <span className="text-muted-foreground">Kein Kommentar.</span>}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
