import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ClientNameAutocomplete } from '@/components/booking/ClientNameAutocomplete'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { MaterialListControls } from '@/components/material/MaterialListControls'
import { PageHeader } from '@/components/PageHeader'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  checkAvailability,
  createBooking,
  getBooking,
  listLoadingFees,
  listMaterials,
  listServices,
  materialAvailability,
  setQuoteProcessed,
  updateBooking,
} from '@/lib/endpoints'
import { ApiError } from '@/lib/api'
import { prepareMaterialList, type MaterialCategoryFilter, type MaterialSort } from '@/lib/materials'
import { MATERIAL_CATEGORY } from '@/lib/status'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BookingRequest, MaterialAvailabilityLine } from '@/lib/types'

const STEPS = ['Kontaktdaten', 'Materialien', 'Services', 'Kommentar', 'Zusammenfassung']

const emptyClient = {
  name: '',
  email: '',
  phoneNumber: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
}

/** Prefill handed over from a quote request (Anfrage → Buchung). */
interface QuotePrefill {
  quoteId: number
  name: string
  email: string
  phoneNumber: string
  postalCode: string
  city: string
  startDate: string
  endDate: string
  materials: Record<number, number>
}

export function BuchungWizardPage() {
  const { id } = useParams()
  const editId = id ? Number(id) : null
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const fromQuote =
    (location.state as { fromQuote?: QuotePrefill } | null)?.fromQuote ?? null

  const [step, setStep] = useState(0)
  const [client, setClient] = useState(() =>
    fromQuote
      ? {
          ...emptyClient,
          name: fromQuote.name,
          email: fromQuote.email,
          phoneNumber: fromQuote.phoneNumber,
          postalCode: fromQuote.postalCode,
          city: fromQuote.city,
        }
      : emptyClient,
  )
  const [startDate, setStartDate] = useState(fromQuote?.startDate ?? '')
  const [endDate, setEndDate] = useState(fromQuote?.endDate ?? fromQuote?.startDate ?? '')
  const [quantities, setQuantities] = useState<Record<number, number>>(
    () => fromQuote?.materials ?? {},
  )
  const [services, setServices] = useState<string[]>([])
  const [loadingFeeId, setLoadingFeeId] = useState<string>('')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [stockOverrideConfirmed, setStockOverrideConfirmed] = useState(false)
  const [stockConfirmOpen, setStockConfirmOpen] = useState(false)
  const [insufficientMaterials, setInsufficientMaterials] = useState<MaterialAvailabilityLine[]>([])
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategoryFilter>('ALL')
  const [materialSort, setMaterialSort] = useState<MaterialSort>('category')

  const { data: materials } = useQuery({ queryKey: ['materials'], queryFn: listMaterials })
  const { data: serviceOptions } = useQuery({ queryKey: ['services'], queryFn: listServices })
  const { data: loadingFees } = useQuery({ queryKey: ['loading-fees'], queryFn: listLoadingFees })

  const { data: availability } = useQuery({
    queryKey: ['availability', startDate, endDate],
    queryFn: () => materialAvailability(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  })

  const { data: existing } = useQuery({
    queryKey: ['booking', editId],
    queryFn: () => getBooking(editId as number),
    enabled: editId != null,
  })

  useEffect(() => {
    if (!existing) return
    setClient({
      name: existing.client.name,
      email: existing.client.email,
      phoneNumber: existing.client.phoneNumber ?? '',
      street: existing.client.street ?? '',
      houseNumber: existing.client.houseNumber ?? '',
      postalCode: existing.client.postalCode ?? '',
      city: existing.client.city ?? '',
    })
    setStartDate(existing.startDate)
    setEndDate(existing.endDate)
    setQuantities(
      Object.fromEntries(existing.materials.map((m) => [m.materialId, m.quantity])),
    )
    setServices(existing.services)
    setLoadingFeeId(existing.loadingFee ? String(existing.loadingFee.id) : '')
    setComment(existing.comment ?? '')
  }, [existing])

  useEffect(() => {
    setStockOverrideConfirmed(false)
  }, [startDate, endDate, quantities])

  const availabilityMap = useMemo(
    () => new Map((availability ?? []).map((a) => [a.materialId, a.available])),
    [availability],
  )

  const visibleMaterials = useMemo(
    () => (materials ? prepareMaterialList(materials, categoryFilter, materialSort) : []),
    [materials, categoryFilter, materialSort],
  )

  const selectedLines = useMemo(
    () =>
      Object.entries(quantities)
        .map(([materialId, quantity]) => ({ materialId: Number(materialId), quantity }))
        .filter((l) => l.quantity > 0),
    [quantities],
  )

  const hasSelbstabholung = services.includes('SELBSTABHOLUNG')

  const hasOverbooking = useMemo(
    () =>
      selectedLines.some((line) => {
        const available = availabilityMap.get(line.materialId)
        return available != null && line.quantity > available
      }),
    [selectedLines, availabilityMap],
  )

  const setQty = (materialId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [materialId]: Math.max(0, value) }))
  }

  const toggleService = (name: string) => {
    setServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    )
  }

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!client.name.trim()) return 'Bitte einen Namen eingeben.'
      if (!client.email.trim()) return 'Bitte eine E-Mail-Adresse eingeben.'
      if (!/.+@.+\..+/.test(client.email)) return 'Bitte eine gültige E-Mail-Adresse eingeben.'
    }
    if (step === 1) {
      if (!startDate || !endDate) return 'Bitte Start- und Enddatum wählen.'
      if (endDate < startDate) return 'Das Enddatum darf nicht vor dem Startdatum liegen.'
      if (selectedLines.length === 0) return 'Bitte mindestens ein Material wählen.'
    }
    if (step === 2 && hasSelbstabholung && !loadingFeeId) {
      return 'Bitte eine Ladepauschale wählen.'
    }
    return null
  }

  const advanceStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))

  const confirmStockOverride = () => {
    setStockOverrideConfirmed(true)
    setStockConfirmOpen(false)
    advanceStep()
  }

  const next = async () => {
    const error = validateStep()
    if (error) {
      toast.error(error)
      return
    }
    if (step === 1) {
      setBusy(true)
      try {
        const result = await checkAvailability({
          startDate,
          endDate,
          materials: selectedLines,
          excludeBookingId: editId,
        })
        if (!result.available) {
          const issues = result.materials.filter((m) => !m.sufficient)
          setInsufficientMaterials(issues)
          const short = issues
            .map((m) => `${m.materialName} (verfügbar: ${m.available})`)
            .join(', ')
          toast.error(`Nicht genügend verfügbar: ${short}`)
          setStockConfirmOpen(true)
          return
        }
        setStockOverrideConfirmed(false)
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : 'Verfügbarkeitsprüfung fehlgeschlagen.')
        return
      } finally {
        setBusy(false)
      }
    }
    advanceStep()
  }

  const submit = async () => {
    setBusy(true)
    const payload: BookingRequest = {
      client: {
        name: client.name,
        email: client.email,
        phoneNumber: client.phoneNumber || undefined,
        street: client.street,
        houseNumber: client.houseNumber,
        postalCode: client.postalCode,
        city: client.city,
      },
      startDate,
      endDate,
      materials: selectedLines,
      services,
      loadingFeeId: hasSelbstabholung && loadingFeeId ? Number(loadingFeeId) : null,
      comment: comment || null,
      ignoreAvailability: stockOverrideConfirmed || undefined,
    }
    try {
      const saved = editId
        ? await updateBooking(editId, payload)
        : await createBooking(payload)

      // Coming from a quote request: mark it processed (booking creation stays
      // successful even if this follow-up fails).
      if (!editId && fromQuote) {
        try {
          await setQuoteProcessed(fromQuote.quoteId, true)
          queryClient.invalidateQueries({ queryKey: ['anfragen'] })
        } catch {
          // ignore — the booking was created regardless
        }
      }

      toast.success(editId ? 'Buchung aktualisiert.' : 'Buchung angelegt.')
      navigate(`/buchungen/${saved.id}`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Speichern fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const materialName = (id: number) => materials?.find((m) => m.id === id)?.name ?? `#${id}`
  const serviceLabel = (name: string) =>
    serviceOptions?.find((s) => s.name === name)?.label ?? name

  return (
    <div>
      <PageHeader title={editId ? 'Buchung bearbeiten' : 'Neue Buchung'} />
      <Stepper steps={STEPS} current={step} onStepClick={setStep} />

      <Card>
        <CardContent className="pt-6">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Name *</Label>
                {/* Only the name is required; all other fields are optional. */}
                <ClientNameAutocomplete
                  value={client.name}
                  onChange={(name) => setClient({ ...client, name })}
                  onSelect={(selected) => setClient(selected)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>E-Mail *</Label>
                <Input
                  type="email"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Telefon</Label>
                <Input
                  value={client.phoneNumber}
                  onChange={(e) => setClient({ ...client, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Straße</Label>
                <Input
                  value={client.street}
                  onChange={(e) => setClient({ ...client, street: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Hausnummer</Label>
                <Input
                  value={client.houseNumber}
                  onChange={(e) => setClient({ ...client, houseNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>PLZ</Label>
                <Input
                  value={client.postalCode}
                  onChange={(e) => setClient({ ...client, postalCode: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Stadt</Label>
                <Input
                  value={client.city}
                  onChange={(e) => setClient({ ...client, city: e.target.value })}
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Startdatum *</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Enddatum *</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {hasOverbooking && startDate && endDate ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Mindestens ein Material übersteigt den verfügbaren Lagerbestand im gewählten Zeitraum.
                </p>
              ) : null}

              <MaterialListControls
                category={categoryFilter}
                sort={materialSort}
                onCategoryChange={setCategoryFilter}
                onSortChange={setMaterialSort}
              />

              <div className="space-y-3 md:hidden">
                {visibleMaterials.map((m) => {
                  const available = availabilityMap.get(m.id)
                  const qty = quantities[m.id] ?? 0
                  const over = available != null && qty > available
                  return (
                    <div key={m.id} className="rounded-lg border p-3">
                      <div className="font-medium">{m.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {MATERIAL_CATEGORY[m.category]}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            'text-sm tabular-nums',
                            over && 'font-semibold text-destructive',
                          )}
                        >
                          Verfügbar:{' '}
                          {startDate && endDate ? (available ?? '–') : `${m.totalCount} gesamt`}
                        </span>
                        <Input
                          type="number"
                          min={0}
                          value={qty || ''}
                          onChange={(e) => setQty(m.id, Number(e.target.value))}
                          className={cn('w-24 text-right', over && 'border-destructive')}
                          aria-label={`Menge ${m.name}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead className="text-right">Verfügbar</TableHead>
                    <TableHead className="w-32 text-right">Menge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleMaterials.map((m) => {
                    const available = availabilityMap.get(m.id)
                    const qty = quantities[m.id] ?? 0
                    const over = available != null && qty > available
                    return (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {MATERIAL_CATEGORY[m.category]}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right tabular-nums',
                            over && 'font-semibold text-destructive',
                          )}
                        >
                          {startDate && endDate ? (available ?? '–') : `${m.totalCount} gesamt`}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            value={qty || ''}
                            onChange={(e) => setQty(m.id, Number(e.target.value))}
                            className={cn('ml-auto w-24 text-right', over && 'border-destructive')}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {(serviceOptions ?? []).map((s) => {
                  const checked = services.includes(s.name)
                  return (
                    <label
                      key={s.name}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors',
                        checked ? 'border-primary bg-secondary' : 'hover:bg-accent',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(s.name)}
                        className="h-4 w-4 accent-primary"
                      />
                      {s.label}
                    </label>
                  )
                })}
              </div>

              {hasSelbstabholung ? (
                <div className="max-w-xs space-y-1.5">
                  <Label>Ladepauschale *</Label>
                  <Select value={loadingFeeId} onValueChange={setLoadingFeeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen…" />
                    </SelectTrigger>
                    <SelectContent>
                      {(loadingFees ?? []).map((fee) => (
                        <SelectItem key={fee.id} value={String(fee.id)}>
                          {fee.name} · {formatCurrency(fee.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-1.5">
              <Label>Kommentar</Label>
              <Textarea
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Interne Notizen oder Sonderwünsche…"
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="mb-2 font-semibold">Kontaktdaten</h3>
                <p>{client.name}</p>
                <p className="text-muted-foreground">{client.email}</p>
                {client.phoneNumber ? (
                  <p className="text-muted-foreground">{client.phoneNumber}</p>
                ) : null}
                <p className="text-muted-foreground">
                  {client.street} {client.houseNumber}, {client.postalCode} {client.city}
                </p>
              </section>
              <section>
                <h3 className="mb-2 font-semibold">Mietzeitraum & Materialien</h3>
                <p className="mb-2 text-muted-foreground">
                  {formatDate(startDate)} bis {formatDate(endDate)}
                </p>
                <ul className="space-y-1">
                  {selectedLines.map((l) => (
                    <li key={l.materialId}>
                      {l.quantity} × {materialName(l.materialId)}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="mb-2 font-semibold">Services</h3>
                {services.length > 0 ? (
                  <ul className="space-y-1">
                    {services.map((s) => (
                      <li key={s}>{serviceLabel(s)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Keine</p>
                )}
              </section>
              {comment ? (
                <section>
                  <h3 className="mb-2 font-semibold">Kommentar</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">{comment}</p>
                </section>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
              disabled={busy}
              className="w-full sm:w-auto"
            >
              {step === 0 ? 'Abbrechen' : 'Zurück'}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} disabled={busy} className="w-full sm:w-auto">
                {busy ? 'Prüfe…' : 'Weiter'}
              </Button>
            ) : (
              <Button onClick={submit} disabled={busy} className="w-full sm:w-auto">
                {busy ? 'Speichert…' : 'Buchung abschließen'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={stockConfirmOpen}
        onOpenChange={setStockConfirmOpen}
        title="Lagerbestand nicht ausreichend"
        description={
          insufficientMaterials.length > 0
            ? `Folgende Materialien sind nicht in ausreichender Menge verfügbar:\n${insufficientMaterials
                .map((m) => `• ${m.materialName} (angefragt: ${m.requested}, verfügbar: ${m.available})`)
                .join('\n')}\n\nTrotzdem mit der Buchung fortfahren?`
            : 'Der Lagerbestand reicht für die gewählten Materialien nicht aus. Trotzdem fortfahren?'
        }
        confirmLabel="Trotzdem fortfahren"
        destructive
        busy={busy}
        onConfirm={confirmStockOverride}
      />
    </div>
  )
}
