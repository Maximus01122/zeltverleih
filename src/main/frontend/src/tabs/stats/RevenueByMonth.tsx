import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyRevenueRow } from "@/model/AllTypes";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import StatistikService from "@/services/StatistikService";


function pivot(rows: MonthlyRevenueRow[]) {
    const years = Array.from(new Set(rows.map(r => r.year))).sort();
    const byMonth: Record<number, any> = {};
    for (let m = 1; m <= 12; m++) {
        byMonth[m] = { month: m };
    }
    rows.forEach(({ year, month, revenue }) => {
        if (!byMonth[month]) byMonth[month] = { month };
        byMonth[month][year] = revenue;
    });
    const monthNames = ["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
    const data = Object.values(byMonth).map((row: any) => ({
        name: monthNames[(row.month - 1 + 12) % 12],
        ...years.reduce((acc, y) => ({ ...acc, [y]: row[y] ?? 0 }), {}),
    }));
    return { data, years };
}

export default function RevenueByMonthChart() {
    const COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
    ];

    const [rows, setRows] = useState<MonthlyRevenueRow[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        StatistikService.getMonthlyRevenue()
            .then(setRows)
            .catch((e) => setError(e?.message ?? "Fehler beim Laden"));
    }, []);

    const { data, years } = useMemo(() => {
        if (!rows) return { data: [], years: [] as number[] };
        return pivot(rows);
    }, [rows]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Umsatz pro Monat (nur abgeschlossene Buchungen)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => `${v.toLocaleString("de-DE")} €`} />
                        <Tooltip
                            formatter={(value: any, name: any) =>
                                [`${Number(value).toLocaleString("de-DE")} €`, String(name)]}
                        />
                        <Legend />
                        {years.map((y, idx) => (
                            <Line
                                key={y}
                                type="monotone"
                                dataKey={String(y)}
                                dot={false}
                                strokeWidth={2}
                                stroke={COLORS[idx % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}