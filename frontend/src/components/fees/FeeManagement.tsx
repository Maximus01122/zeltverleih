import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { ApiError } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import type { LoadingFee, StandardFeeRequest } from '@/lib/types'

type Fee = LoadingFee

type DialogState =
  | { type: 'create' }
  | { type: 'edit'; fee: Fee }
  | { type: 'delete'; fee: Fee }
  | null

export function FeeManagement({
  title,
  description,
  queryKey,
  listFees,
  createFee,
  updateFee,
  deleteFee,
}: {
  title: string
  description: string
  queryKey: string[]
  listFees: () => Promise<Fee[]>
  createFee: (body: StandardFeeRequest) => Promise<Fee>
  updateFee: (id: number, body: StandardFeeRequest) => Promise<Fee>
  deleteFee: (id: number) => Promise<void>
}) {
  const [dialog, setDialog] = useState<DialogState>(null)

  const { data: fees, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: listFees,
  })

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button onClick={() => setDialog({ type: 'create' })} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Neu anlegen
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-3 md:hidden">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">Lädt…</p>
          ) : isError ? (
            <p className="py-10 text-center text-destructive">
              {error instanceof ApiError ? error.message : `${title} konnten nicht geladen werden.`}
            </p>
          ) : fees && fees.length > 0 ? (
            fees.map((fee) => (
              <div key={fee.id} className="rounded-lg border p-4">
                <div className="font-medium">{fee.name}</div>
                <div className="mt-1 text-sm tabular-nums text-muted-foreground">
                  {formatCurrency(fee.price)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDialog({ type: 'edit', fee })}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDialog({ type: 'delete', fee })}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">Noch keine Einträge angelegt.</p>
          )}
        </div>

        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Preis</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  Lädt…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-destructive">
                  {error instanceof ApiError ? error.message : `${title} konnten nicht geladen werden.`}
                </TableCell>
              </TableRow>
            ) : fees && fees.length > 0 ? (
              fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(fee.price)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Aktionen">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDialog({ type: 'edit', fee })}>
                          <Pencil className="h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDialog({ type: 'delete', fee })}
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
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  Noch keine Einträge angelegt.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {dialog?.type === 'create' || dialog?.type === 'edit' ? (
        <FeeDialog
          key={dialog.type === 'edit' ? `edit-${dialog.fee.id}` : 'create'}
          title={dialog.type === 'create' ? `${title} anlegen` : `${title} bearbeiten`}
          fee={dialog.type === 'edit' ? dialog.fee : null}
          open
          onOpenChange={(open) => !open && setDialog(null)}
          onSave={async (body) => {
            if (dialog.type === 'create') {
              await createFee(body)
              toast.success(`${title} angelegt.`)
            } else {
              await updateFee(dialog.fee.id, body)
              toast.success(`${title} aktualisiert.`)
            }
          }}
          queryKey={queryKey}
        />
      ) : null}

      {dialog?.type === 'delete' ? (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          title={`${title} löschen`}
          description={`„${dialog.fee.name}" wirklich löschen?`}
          confirmLabel="Löschen"
          destructive
          onConfirm={async () => {
            try {
              await deleteFee(dialog.fee.id)
              toast.success(`${title} gelöscht.`)
              setDialog(null)
            } catch (err) {
              toast.error(err instanceof ApiError ? err.message : 'Löschen fehlgeschlagen.')
              throw err
            }
          }}
        />
      ) : null}
    </div>
  )
}

function FeeDialog({
  title,
  fee,
  open,
  onOpenChange,
  onSave,
  queryKey,
}: {
  title: string
  fee: Fee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (body: StandardFeeRequest) => Promise<void>
  queryKey: string[]
}) {
  const qc = useQueryClient()
  const [name, setName] = useState(fee?.name ?? '')
  const [price, setPrice] = useState(fee ? String(fee.price) : '')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!name.trim()) {
      toast.error('Bitte einen Namen eingeben.')
      return
    }
    const parsedPrice = Number(price)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error('Bitte einen gültigen Preis eingeben.')
      return
    }
    setBusy(true)
    try {
      await onSave({ name: name.trim(), price: parsedPrice })
      qc.invalidateQueries({ queryKey })
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Preis (€)</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={busy}>
            {busy ? 'Speichert…' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
