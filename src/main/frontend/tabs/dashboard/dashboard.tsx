import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"

import {Overview} from "@/components/ui/overview"
import Menu from "@/tabs/navigation/menuNew";
import React, {useEffect} from "react";
import BookingService from "@/services/BookingService";
import {numberWithCommas} from "@/model/helperFunctions";
import taxIcon from "@/tabs/navigation/tax-calculate.png";
import coinIcon from "@/tabs/navigation/euro-coin.png";

const monthNames: { [key: string]: string } = {
    JANUAR: "Januar",
    JANUARY: "Januar",
    FEBRUARY: "Februar",
    MARCH: "März",
    APRIL: "April",
    MAY: "Mai",
    JUNE: "Juni",
    JULY: "Juli",
    AUGUST: "August",
    SEPTEMBER: "September",
    OCTOBER: "Oktober",
    NOVEMBER: "November",
    DECEMBER: "Dezember"
};

interface MonthlyData {
    name: string;
    [year: string]: number | string;
}



export default function DashboardPage() {
    let [countBuchung, setCountBuchung] = React.useState(0)
    let [incomeNetto, setIncomeNetto] = React.useState(0)
    let [incomeBrutto, setIncomeBrutto] = React.useState(0)
    let [tax, setTax] = React.useState(0)
    let [dataIncome, setDataIncome] = React.useState<{name:string,total:number}[]>([])
    let [incomePerMonthPerYearData, setIncomePerMonthPerYearData] = React.useState<MonthlyData[]>([])
    let [incomePerKategoriePerYearData, setIncomePerKategoriePerYearData] = React.useState<MonthlyData[]>(
        Array.of({'Zelt': 75, 'Garnitur': 310, name: "2023"}, {'Zelt': 75, 'Garnitur': 310, name: "2024"})
    )
    let [countBuchungPerMonthPerYearData, setcountBuchungPerMonthPerYearData] =
        React.useState<MonthlyData[]>([])

    function convertData(data: { [month: string]: { [year: string]: number } }): MonthlyData[] {
        const result: MonthlyData[] = [];
        for (const [month, yearData] of Object.entries(data)) {
            const monthlyData: MonthlyData = { name: monthNames[month] };
            for (const [year, value] of Object.entries(yearData)) {
                monthlyData[year] = value;
            }
            result.push(monthlyData);
        }
        console.log('monthly done', result)
        return result;
    }
    useEffect(
        () =>{
            BookingService.getIncome().then(r => {
                setIncomeNetto(r.data["Netto"]);
                setIncomeBrutto(r.data["Brutto"]);
                setTax(r.data["Mehrwertsteuer"]);
            })
            BookingService.countBuchungByStatus("COMPLETED").then(
                r => setCountBuchung(r.data)
            )
            BookingService.incomePerMonthPerYear().then(r =>
                {
                    let dataArray = convertData(r.data)
                    setIncomePerMonthPerYearData(dataArray)
                }
            )

            BookingService.countBuchungPerMonthPerYear().then(r =>
                {
                    console.log("count",r.data)
                    let dataArray = convertData(r.data)
                    setcountBuchungPerMonthPerYearData(dataArray)
                }
            )
        },[]
    )
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">
                                    Nettoeinkommen
                                </CardTitle>
                                <img src={coinIcon}  className={"h-6 w-6 text-muted-foreground"}/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(incomeNetto)}€</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">
                                    Mehrwertsteuer
                                </CardTitle>
                                <img src={taxIcon}  className={"h-6 w-6 text-muted-foreground"}/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(tax)}€</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-medium">
                                    gesamte Einnahmen
                                </CardTitle>
                                €
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{numberWithCommas(incomeBrutto)}€</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-7">
                            <CardHeader>
                                <CardTitle>Einkommen pro Monat</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={incomePerMonthPerYearData}/>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-7">
                            <CardHeader>
                                <CardTitle>Einkommen pro Kategorie</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={incomePerKategoriePerYearData}/>
                            </CardContent>
                        </Card>
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
                                <div className="text-2xl font-bold">{91}</div>
                                <p className="text-xs text-muted-foreground"></p>
                            </CardContent>
                        </Card>
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Buchungen pro Monat</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={countBuchungPerMonthPerYearData}/>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
</>
)
}
