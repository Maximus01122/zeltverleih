import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { materialAvailability } from '@/lib/endpoints'
import { MATERIAL_CATEGORY, MATERIAL_CATEGORY_ORDER } from '@/lib/status'
import { cn } from '@/lib/utils'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

export function LagerPage() {
  const [from, setFrom] = useState(isoToday())
  const [to, setTo] = useState(isoToday())

  const { data, isLoading } = useQuery({
    queryKey: ['material-availability', from, to],
    queryFn: () => materialAvailability(from, to),
    enabled: Boolean(from && to && to >= from),
  })

  return (
    <div>
      <PageHeader
        title="Lager"
        description="Verfügbare Einheiten je Material im gewählten Zeitraum."
      />

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
        </div>
      </Card>

      <Tabs defaultValue={MATERIAL_CATEGORY_ORDER[0]}>
        <TabsList className="flex-wrap">
          {MATERIAL_CATEGORY_ORDER.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {MATERIAL_CATEGORY[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {MATERIAL_CATEGORY_ORDER.map((cat) => {
          const rows = (data ?? []).filter((m) => m.category === cat)
          return (
            <TabsContent key={cat} value={cat}>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Verfügbar</TableHead>
                        <TableHead className="text-right">Gesamtbestand</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                            Lädt…
                          </TableCell>
                        </TableRow>
                      ) : rows.length > 0 ? (
                        rows.map((m) => (
                          <TableRow key={m.materialId}>
                            <TableCell className="font-medium">{m.name}</TableCell>
                            <TableCell
                              className={cn(
                                'text-right tabular-nums font-medium',
                                m.available === 0 && 'text-destructive',
                              )}
                            >
                              {m.available}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {m.totalCount}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                            Keine Materialien in dieser Kategorie.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
