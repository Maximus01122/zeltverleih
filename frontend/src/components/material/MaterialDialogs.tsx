import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
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
import { addPriceVersion, createMaterial, deletePriceVersion, updateMaterial, updatePriceVersion } from '@/lib/endpoints'
import { ApiError } from '@/lib/api'
import { MATERIAL_CATEGORY, MATERIAL_CATEGORY_ORDER } from '@/lib/status'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Material, MaterialCategory, PriceView } from '@/lib/types'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['materials'] })
  qc.invalidateQueries({ queryKey: ['material-availability'] })
}

export function MaterialCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<MaterialCategory>('ZELTE')
  const [totalCount, setTotalCount] = useState('1')
  const [daily, setDaily] = useState('0')
  const [weekend, setWeekend] = useState('0')
  const [assembly, setAssembly] = useState('0')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!name.trim()) {
      toast.error('Bitte einen Namen eingeben.')
      return
    }
    setBusy(true)
    try {
      await createMaterial({
        name,
        category,
        totalCount: Number(totalCount),
        dailyPrice: Number(daily),
        weekendPrice: Number(weekend),
        assemblyPrice: Number(assembly),
      })
      toast.success('Material angelegt.')
      invalidate(qc)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Anlegen fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neues Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MaterialCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {MATERIAL_CATEGORY[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Gesamtanzahl</Label>
            <Input
              type="number"
              min={0}
              value={totalCount}
              onChange={(e) => setTotalCount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagespreis</Label>
            <Input type="number" min={0} step="0.01" value={daily} onChange={(e) => setDaily(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Wochenendpreis</Label>
            <Input type="number" min={0} step="0.01" value={weekend} onChange={(e) => setWeekend(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Aufbaupreis</Label>
            <Input type="number" min={0} step="0.01" value={assembly} onChange={(e) => setAssembly(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Abbrechen
          </Button>
          <Button onClick={save} disabled={busy}>
            Anlegen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function MaterialEditDialog({
  material,
  open,
  onOpenChange,
}: {
  material: Material
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const qc = useQueryClient()
  const [name, setName] = useState(material.name)
  const [category, setCategory] = useState<MaterialCategory>(material.category)
  const [totalCount, setTotalCount] = useState(String(material.totalCount))
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await updateMaterial(material.id, {
        name,
        category,
        totalCount: Number(totalCount),
      })
      toast.success('Material aktualisiert.')
      invalidate(qc)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Speichern fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Material anpassen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MaterialCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {MATERIAL_CATEGORY[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Gesamtanzahl</Label>
            <Input
              type="number"
              min={0}
              value={totalCount}
              onChange={(e) => setTotalCount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Abbrechen
          </Button>
          <Button onClick={save} disabled={busy}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PriceDialog({
  material,
  open,
  onOpenChange,
}: {
  material: Material
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const qc = useQueryClient()
  const [daily, setDaily] = useState('0')
  const [weekend, setWeekend] = useState('0')
  const [assembly, setAssembly] = useState('0')
  const [validFrom, setValidFrom] = useState(isoToday())
  const [editingPrice, setEditingPrice] = useState<PriceView | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PriceView | null>(null)
  const [busy, setBusy] = useState(false)

  const resetForm = () => {
    setDaily('0')
    setWeekend('0')
    setAssembly('0')
    setValidFrom(isoToday())
    setEditingPrice(null)
  }

  const startEdit = (price: PriceView) => {
    setEditingPrice(price)
    setDaily(String(price.dailyPrice))
    setWeekend(String(price.weekendPrice))
    setAssembly(String(price.assemblyPrice))
    setValidFrom(price.validFrom)
  }

  const save = async () => {
    setBusy(true)
    try {
      const body = {
        dailyPrice: Number(daily),
        weekendPrice: Number(weekend),
        assemblyPrice: Number(assembly),
        validFrom,
      }
      if (editingPrice) {
        await updatePriceVersion(material.id, editingPrice.id, body)
        toast.success('Preisversion aktualisiert.')
        resetForm()
      } else {
        await addPriceVersion(material.id, body)
        toast.success('Neue Preisversion hinzugefügt.')
        onOpenChange(false)
      }
      invalidate(qc)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Preisversion fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!deleteTarget) return
    setBusy(true)
    try {
      await deletePriceVersion(material.id, deleteTarget.id)
      toast.success('Preisversion gelöscht.')
      if (editingPrice?.id === deleteTarget.id) {
        resetForm()
      }
      invalidate(qc)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Löschen fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) resetForm()
          onOpenChange(next)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preise anpassen · {material.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tagespreis</Label>
              <Input type="number" min={0} step="0.01" value={daily} onChange={(e) => setDaily(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Wochenendpreis</Label>
              <Input type="number" min={0} step="0.01" value={weekend} onChange={(e) => setWeekend(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Aufbaupreis</Label>
              <Input type="number" min={0} step="0.01" value={assembly} onChange={(e) => setAssembly(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Gültig ab</Label>
              <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
            </div>
          </div>

          {material.priceHistory.length > 0 ? (
            <div className="mt-2">
              <p className="mb-2 text-sm font-medium">Preishistorie</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gültig ab</TableHead>
                    <TableHead className="text-right">Tag</TableHead>
                    <TableHead className="text-right">Wochenende</TableHead>
                    <TableHead className="text-right">Aufbau</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {material.priceHistory.map((p) => (
                    <TableRow key={p.id} className={editingPrice?.id === p.id ? 'bg-muted/50' : undefined}>
                      <TableCell>{formatDate(p.validFrom)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(p.dailyPrice)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(p.weekendPrice)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(p.assemblyPrice)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Preisversion bearbeiten"
                            onClick={() => startEdit(p)}
                            disabled={busy}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Preisversion löschen"
                            onClick={() => setDeleteTarget(p)}
                            disabled={busy || material.priceHistory.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          <DialogFooter>
            {editingPrice ? (
              <Button variant="outline" onClick={resetForm} disabled={busy}>
                Bearbeitung abbrechen
              </Button>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Abbrechen
              </Button>
            )}
            <Button onClick={save} disabled={busy}>
              {editingPrice ? 'Änderungen speichern' : 'Preisversion speichern'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deleteTarget ? (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDeleteTarget(null)}
          title="Preisversion löschen?"
          description={`Der Eintrag gültig ab ${formatDate(deleteTarget.validFrom)} wird unwiderruflich gelöscht.`}
          confirmLabel="Löschen"
          destructive
          busy={busy}
          onConfirm={remove}
        />
      ) : null}
    </>
  )
}
