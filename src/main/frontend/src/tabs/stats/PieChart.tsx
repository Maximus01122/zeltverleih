import { LabelList, Pie, PieChart } from "recharts"
import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import StatsService from "@/services/StatsService"

/** Fixed palette cycling through the CSS chart tokens that actually exist. */
const CHART_PALETTE = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

type DataItem = { name: string; revenue: number };

/**
 * Adds a `fill` colour to each datum by cycling through CHART_PALETTE.
 */
function addFills(data: DataItem[]): (DataItem & { fill: string })[] {
    return data.map((item, i) => ({
        ...item,
        fill: CHART_PALETTE[i % CHART_PALETTE.length],
    }));
}

/**
 * Builds a ChartConfig keyed by item name, each entry gets a label and the
 * same colour used as the fill above so the tooltip/legend stay in sync.
 */
function buildConfig(data: DataItem[]): ChartConfig {
    return data.reduce((cfg, item, i) => {
        cfg[item.name] = {
            label: item.name,
            color: CHART_PALETTE[i % CHART_PALETTE.length],
        };
        return cfg;
    }, {} as ChartConfig);
}

type ChartPieLabelListProps = {
    titel: string;
    /** If provided, renders this static data instead of fetching from the backend. */
    data?: DataItem[];
};

export function ChartPieLabelList(props: ChartPieLabelListProps) {
    const [data, setData] = useState<DataItem[]>(props.data ?? []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Use provided static data if supplied
        if (props.data && props.data.length > 0) {
            setData(props.data);
            return;
        }
        let mounted = true;
        setLoading(true);
        StatsService.getIncomeByCategory()
            .then(d => { if (mounted) setData(d); })
            .catch(e => { if (mounted) setError(e?.message ?? "Fehler beim Laden"); })
            .finally(() => { if (mounted) setLoading(false); });

        return () => { mounted = false; };
    }, [props.data]);

    const chartData   = addFills(data);
    const chartConfig = buildConfig(data);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{props.titel}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {loading && <div className="text-sm text-muted-foreground mt-2">Lade Daten…</div>}
                {error   && <div className="text-sm text-red-500 mt-2">{error}</div>}
                {!loading && !error && data.length === 0 && (
                    <div className="text-sm text-muted-foreground mt-2">Keine Daten vorhanden</div>
                )}
                {data.length > 0 && (
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartData} dataKey="revenue">
                                <LabelList
                                    className="fill-background"
                                    stroke="none"
                                    fontSize={12}
                                    formatter={(value: keyof typeof chartConfig) =>
                                        chartConfig[value]?.label
                                    }
                                />
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
