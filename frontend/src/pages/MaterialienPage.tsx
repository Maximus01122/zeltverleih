import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MoreHorizontal, Package, Plus } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { FeeManagement } from '@/components/fees/FeeManagement'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MaterialCreateDialog,
  MaterialEditDialog,
  PriceDialog,
} from '@/components/material/MaterialDialogs'
import { MaterialListControls } from '@/components/material/MaterialListControls'
import { listMaterials, listLoadingFees, listDeliveryFees, createLoadingFee, updateLoadingFee, deleteLoadingFee, createDeliveryFee, updateDeliveryFee, deleteDeliveryFee } from '@/lib/endpoints'
import { prepareMaterialList, type MaterialCategoryFilter, type MaterialSort } from '@/lib/materials'
import { MATERIAL_CATEGORY } from '@/lib/status'
import { formatCurrency } from '@/lib/format'
import { ApiError } from '@/lib/api'
import type { Material } from '@/lib/types'

type DialogState =
  | { type: 'create' }
  | { type: 'edit' | 'price'; material: Material }
  | null

export function MaterialienPage() {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [activeTab, setActiveTab] = useState('materialien')
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategoryFilter>('ALL')
  const [sort, setSort] = useState<MaterialSort>('category')

  const { data: materials, isLoading, isError, error } = useQuery({
    queryKey: ['materials'],
    queryFn: listMaterials,
  })

  const visibleMaterials = useMemo(
    () => (materials ? prepareMaterialList(materials, categoryFilter, sort) : []),
    [materials, categoryFilter, sort],
  )

  return (
    <div>
      <PageHeader
        title="Materialien"
        description="Materialien, Ladepauschalen und Lieferkosten verwalten."
        action={
          activeTab === 'materialien' ? (
            <Button onClick={() => setDialog({ type: 'create' })} className="hidden sm:inline-flex">
              <Plus className="h-4 w-4" />
              Neues Material
            </Button>
          ) : null
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="materialien">Materialien</TabsTrigger>
          <TabsTrigger value="loading-fees">Ladepauschalen</TabsTrigger>
          <TabsTrigger value="delivery-fees">Lieferpauschale</TabsTrigger>
        </TabsList>

        <TabsContent value="materialien">
          <div className="mb-4 flex justify-end sm:hidden">
            <Button onClick={() => setDialog({ type: 'create' })} className="w-full">
              <Plus className="h-4 w-4" />
              Neues Material
            </Button>
          </div>

      <Card className="space-y-4 p-4">
        <MaterialListControls
          category={categoryFilter}
          sort={sort}
          onCategoryChange={setCategoryFilter}
          onSortChange={setSort}
        />
        <div className="space-y-3 md:hidden">
          {isLoading ? (
            <p className="py-10 text-center text-muted-foreground">Lädt…</p>
          ) : isError ? (
            <p className="py-10 text-center text-destructive">
              {error instanceof ApiError ? error.message : 'Materialien konnten nicht geladen werden.'}
            </p>
          ) : materials && materials.length > 0 ? (
            visibleMaterials.map((m) => (
              <div key={m.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 font-medium">{m.name}</div>
                  <Badge variant="secondary">{MATERIAL_CATEGORY[m.category]}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Bestand</dt>
                    <dd className="tabular-nums">{m.totalCount}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tag</dt>
                    <dd className="tabular-nums">
                      {m.currentPrice ? formatCurrency(m.currentPrice.dailyPrice) : '–'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Wochenende</dt>
                    <dd className="tabular-nums">
                      {m.currentPrice ? formatCurrency(m.currentPrice.weekendPrice) : '–'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Aufbau</dt>
                    <dd className="tabular-nums">
                      {m.currentPrice ? formatCurrency(m.currentPrice.assemblyPrice) : '–'}
                    </dd>
                  </div>
                </dl>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDialog({ type: 'edit', material: m })}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDialog({ type: 'price', material: m })}
                  >
                    Preise
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-muted-foreground">Noch keine Materialien angelegt.</p>
          )}
        </div>
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Bestand</TableHead>
              <TableHead className="text-right">Tagespreis</TableHead>
              <TableHead className="text-right">Wochenendpreis</TableHead>
              <TableHead className="text-right">Aufbaupreis</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Lädt…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-destructive">
                  {error instanceof ApiError ? error.message : 'Materialien konnten nicht geladen werden.'}
                </TableCell>
              </TableRow>
            ) : materials && materials.length > 0 ? (
              visibleMaterials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{MATERIAL_CATEGORY[m.category]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{m.totalCount}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.currentPrice ? formatCurrency(m.currentPrice.dailyPrice) : '–'}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.currentPrice ? formatCurrency(m.currentPrice.weekendPrice) : '–'}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.currentPrice ? formatCurrency(m.currentPrice.assemblyPrice) : '–'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Aktionen">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDialog({ type: 'edit', material: m })}>
                          <Package className="h-4 w-4" />
                          Material anpassen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDialog({ type: 'price', material: m })}>
                          <Plus className="h-4 w-4" />
                          Preise anpassen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Noch keine Materialien angelegt.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
        </TabsContent>

        <TabsContent value="loading-fees">
          <FeeManagement
            title="Ladepauschale"
            description="Standardwerte für Selbstabholung im Buchungswizard."
            queryKey={['loading-fees']}
            listFees={listLoadingFees}
            createFee={createLoadingFee}
            updateFee={updateLoadingFee}
            deleteFee={deleteLoadingFee}
          />
        </TabsContent>

        <TabsContent value="delivery-fees">
          <FeeManagement
            title="Lieferpauschale"
            description="Standardwert für das Angebotsformular bei Lieferung."
            queryKey={['delivery-fees']}
            listFees={listDeliveryFees}
            createFee={createDeliveryFee}
            updateFee={updateDeliveryFee}
            deleteFee={deleteDeliveryFee}
          />
        </TabsContent>
      </Tabs>

      {dialog?.type === 'create' ? (
        <MaterialCreateDialog open onOpenChange={(o) => !o && setDialog(null)} />
      ) : null}
      {dialog?.type === 'edit' ? (
        <MaterialEditDialog
          material={dialog.material}
          open
          onOpenChange={(o) => !o && setDialog(null)}
        />
      ) : null}
      {dialog?.type === 'price' ? (
        <PriceDialog
          material={materials?.find((m) => m.id === dialog.material.id) ?? dialog.material}
          open
          onOpenChange={(o) => !o && setDialog(null)}
        />
      ) : null}
    </div>
  )
}
