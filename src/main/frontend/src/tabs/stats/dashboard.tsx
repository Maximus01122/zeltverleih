import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"

import Menu from "@/tabs/navigation/menuNew";
import React, {useEffect, useState} from "react";
import {numberWithCommas} from "@/model/helperFunctions";
import taxIcon from "@/tabs/navigation/tax-calculate.png";
import coinIcon from "@/tabs/navigation/euro-coin.png";
import RevenueByMonthChart from "@/tabs/stats/RevenueByMonth";
import statistikService from "@/services/StatistikService";
import {ChartPieLabelList} from "@/tabs/stats/PieChart";
import StatsService from "@/services/StatsService";
import BookingService from "@/services/BookingService";

export default function DashboardPage() {
    const [incomeNetto, setIncomeNetto]   = useState<number>(0);
    const [incomeBrutto, setIncomeBrutto] = useState<number>(0);
    const [tax, setTax]                   = useState<number>(0);
    const [countBuchung, setCountBuchung] = useState<number | null>(null);
    const [serviceData, setServiceData]   = useState<{name: string; revenue: number}[]>([]);

    // P0 fix: dependency array [] — runs once on mount only
    useEffect(() => {
        statistikService.getIncome().then(r => {
            setIncomeNetto(r.data['Netto']);
            setIncomeBrutto(r.data['Brutto']);
            setTax(r.data['Mehrwertsteuer']);
        }).catch(console.error);
    }, []);

    // P0 fix: fetch real booking count for current year (was hardcoded to 91)
    useEffect(() => {
        BookingService.countBuchungByStatus("COMPLETED").then(r => {
            setCountBuchung(r?.data ?? null);
        }).catch(console.error);
    }, []);

    // P2: fetch service revenue distribution for the second pie chart
    useEffect(() => {
        StatsService.getCountService().then(raw => {
            const entries = Object.entries(raw).map(([name, revenue]) => ({
                name,
                revenue: Number(revenue),
            }));
            setServiceData(entries);
        }).catch(console.error);
    }, []);

    return (
        <>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <Menu/>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Finanzen</TabsTrigger>
                    <TabsTrigger value="analytics">Buchungen</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* KPI cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">Nettoeinkommen</CardTitle>
                                <img src={coinIcon} className={"h-6 w-6 text-muted-foreground"} alt="coin icon"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(incomeNetto)}€</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">Mehrwertsteuer</CardTitle>
                                <img src={taxIcon} className={"h-6 w-6 text-muted-foreground"} alt="tax icon"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(tax)}€</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">Gesamte Einnahmen</CardTitle>
                                <span className="text-muted-foreground text-lg">€</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(incomeBrutto)}€</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly revenue line chart */}
                    <RevenueByMonthChart/>

                    {/* Pie charts — first fetches live category data, second live service distribution */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <ChartPieLabelList titel={"Einkommen nach Kategorie"}/>
                        <ChartPieLabelList titel={"Einkommen nach Dienstleistung"} data={serviceData}/>
                    </div>
                </TabsContent>

                <TabsContent value={"analytics"}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">
                                    Buchungen in {new Date().getFullYear()}
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </CardHeader>
                            <CardContent>
                                {/* P0 fix: was hardcoded to {91}, now fetched from backend */}
                                <div className="text-2xl font-bold">
                                    {countBuchung !== null ? countBuchung : '—'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
        </>
    );
}
