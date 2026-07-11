import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PageHeader } from '@/components/PageHeader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { bookingDashboard, financeDashboard } from '@/lib/endpoints'
import { formatCurrency, formatMonth } from '@/lib/format'
import { MATERIAL_CATEGORY } from '@/lib/status'
import type { MaterialCategory } from '@/lib/types'

// Brand-derived chart palette (Festblau, Himmelblau, Sonnengelb, Nachtblau, Schiefer)
const PIE_COLORS = ['#1F5C8B', '#3D7EB5', '#F4B41E', '#123A5A', '#5A6672']

function Kpi({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={accent ? 'text-3xl font-bold text-primary' : 'text-3xl font-bold'}>
          {formatCurrency(value)}
        </div>
      </CardContent>
    </Card>
  )
}

function FinanceTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'finance'],
    queryFn: financeDashboard,
  })

  if (isLoading || !data) return <p className="text-muted-foreground">Lädt…</p>

  const monthly = data.monthlyRevenue.map((m) => ({
    label: formatMonth(m.year, m.month),
    net: m.net,
  }))
  const byCategory = data.incomeByCategory.map((c) => ({
    label: MATERIAL_CATEGORY[c.category as MaterialCategory] ?? c.category,
    value: c.net,
  }))
  const byService = data.incomeByService.map((s) => ({ label: s.label, value: s.net }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Nettoeinkommen" value={data.netTotal} accent />
        <Kpi label="Mehrwertsteuer (19 %)" value={data.vatTotal} />
        <Kpi label="Gesamteinnahmen (brutto)" value={data.grossTotal} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Einnahmen pro Monat</CardTitle>
        </CardHeader>
        <CardContent>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly}>
                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v} €`}
                />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="net" fill="#1F5C8B" radius={[4, 4, 0, 0]} name="Netto" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-muted-foreground">Noch keine Daten.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <PieCard title="Einkommen nach Materialkategorie" data={byCategory} />
        <PieCard title="Einkommen nach Dienstleistung" data={byService} />
      </div>
    </div>
  )
}

function PieCard({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-10 text-center text-muted-foreground">Noch keine Daten.</p>
        )}
      </CardContent>
    </Card>
  )
}

function BookingsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'bookings'],
    queryFn: bookingDashboard,
  })

  if (isLoading || !data) return <p className="text-muted-foreground">Lädt…</p>

  return (
    <Card className="max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Abgeschlossene Buchungen {data.year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary">{data.completedThisYear}</div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Statistiken und Kennzahlen." />
      <Tabs defaultValue="finance">
        <TabsList>
          <TabsTrigger value="finance">Finanzen</TabsTrigger>
          <TabsTrigger value="bookings">Buchungen</TabsTrigger>
        </TabsList>
        <TabsContent value="finance">
          <FinanceTab />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
