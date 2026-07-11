import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { formatCurrency } from '@/lib/format'
import type { DocumentItem } from '@/lib/types'

const VAT_RATE = 0.19

export interface EditorItem {
  description: string
  quantity: number
  unitPrice: number
}

export function computeTotals(items: EditorItem[]) {
  const net = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const vat = net * VAT_RATE
  return { net, vat, gross: net + vat }
}

export function toDocumentItems(items: EditorItem[]): DocumentItem[] {
  return items.map((i) => ({
    description: i.description,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
  }))
}

function TotalsSummary({ items }: { items: EditorItem[] }) {
  const totals = computeTotals(items)
  return (
    <div className="w-full space-y-1 text-sm sm:w-56">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Summe netto</span>
        <span className="tabular-nums">{formatCurrency(totals.net)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">MwSt 19 %</span>
        <span className="tabular-nums">{formatCurrency(totals.vat)}</span>
      </div>
      <div className="flex justify-between border-t pt-1 font-semibold">
        <span>Summe brutto</span>
        <span className="tabular-nums">{formatCurrency(totals.gross)}</span>
      </div>
    </div>
  )
}

export function ItemsEditor({
  items,
  onChange,
}: {
  items: EditorItem[]
  onChange: (items: EditorItem[]) => void
}) {
  const update = (index: number, patch: Partial<EditorItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }
  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }
  const add = () => {
    onChange([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Noch keine Positionen.</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="space-y-3 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium">Position {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label="Position löschen"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Bezeichnung</Label>
                <Input
                  value={item.description}
                  onChange={(e) => update(index, { description: e.target.value })}
                  placeholder="Bezeichnung"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Menge</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => update(index, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Einzelpreis</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => update(index, { unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gesamt</span>
                <span className="tabular-nums font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[46%]">Bezeichnung</TableHead>
            <TableHead className="w-[15%]">Menge</TableHead>
            <TableHead className="w-[19%]">Einzelpreis</TableHead>
            <TableHead className="w-[15%] text-right">Gesamt</TableHead>
            <TableHead className="w-[5%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="p-2">
                <Input
                  value={item.description}
                  onChange={(e) => update(index, { description: e.target.value })}
                  placeholder="Bezeichnung"
                />
              </TableCell>
              <TableCell className="p-2">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => update(index, { quantity: Number(e.target.value) })}
                />
              </TableCell>
              <TableCell className="p-2">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => update(index, { unitPrice: Number(e.target.value) })}
                />
              </TableCell>
              <TableCell className="p-2 text-right tabular-nums">
                {formatCurrency(item.quantity * item.unitPrice)}
              </TableCell>
              <TableCell className="p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label="Position löschen"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                Noch keine Positionen.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Button type="button" variant="outline" size="sm" onClick={add} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Position hinzufügen
        </Button>
        <TotalsSummary items={items} />
      </div>
    </div>
  )
}
