import React, {useEffect, useState} from "react";
import AdminNavbar from "../navigation/AdminNavbar";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import {AxiosResponse} from "axios";
import {Doughnut, Line} from "react-chartjs-2";
import 'chart.js/auto';
import {StatistikMaterial} from "@/model/AllTypes";
import TableBody from "@mui/material/TableBody";
import StatistikService from "../../services/StatistikService";
import "./statistik.css";
export default function Statistiken (){

    const [materialien,setMaterialien] = useState<StatistikMaterial[][]>([])
    const [kategorien, setKategorien] = useState<string[]>([])
    const [distributionKategorieLabels, setDistributionKategorieLabels] = useState<string[]>([])
    const [distributionKategorieValues, setDistributionKategorieValues] = useState<number[]>([])
    const [distributionServiceLabels, setDistributionServiceLabels] = useState<string[]>([])
    const [distributionServiceValues, setDistributionServiceValues] = useState<number[]>([])
    const [distributionRevenueLabels, setDistributionRevenueLabels] = useState<string[]>([])
    const [distributionRevenueValues, setDistributionRevenueValues] = useState<number[]>([])
    const [countPerMonthLabels, setCountPerMonthLabels] = useState<string[]>([])
    const [countPerMonthValues, setCountPerMonthValues] = useState<number[]>([])

    useEffect(() => {
            StatistikService.topFiveItems().then(
                (result:AxiosResponse<StatistikMaterial[]>) => {
                    let list:StatistikMaterial[][] = []
                    let kategorie:string[] = []
                    let rang = Infinity
                    result.data.forEach(sm => {
                        if(sm.rang<rang){
                            list.push([sm])
                            kategorie.push(sm.category)
                        }
                        else {
                            if (list.length!=0){
                                // @ts-ignore
                                list.at(-1).push(sm)
                            }
                        }
                        rang=sm.rang;
                    })
                    const lengths = list.map(a=>a.length);
                    const max = lengths.indexOf(Math.max(...lengths));
                    console.log(list,max)
                    list = list[max].map((col, i) => list.map(row => row[i]))
                    setMaterialien(list)
                    setKategorien(kategorie)
                }
            )
    },[])

    useEffect(() => {
        StatistikService.distributionKategorie().then(
            (result:AxiosResponse<[{string:string, aDouble:number}]>) => {
                let labels: string[] = []
                let data: number[] = []
                result.data.forEach(kd => {
                    labels.push(kd.string);
                    data.push(kd.aDouble)
                })
                setDistributionKategorieLabels(labels)
                setDistributionKategorieValues(data)
            })
    },[])

    useEffect(() => {
        StatistikService.distributionService().then(
            (result:AxiosResponse<[{string:string, aDouble:number}]>) => {
                let labels: string[] = []
                let data: number[] = []
                result.data.forEach(kd => {
                    labels.push(kd.string);
                    data.push(kd.aDouble)
                })
                setDistributionServiceLabels(labels)
                setDistributionServiceValues(data)
            })
    },[])

    const monatNamen = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
    "Oktober", "November", "Dezember"]
    useEffect(() => {
        StatistikService.distributionRevenue().then(
            (result:AxiosResponse<[{monat:number, anzahl:number}]>) => {
                let labels: number[] = []
                let data: number[] = []
                result.data.forEach(kd => {
                    labels.push(kd.monat);
                    data.push(kd.anzahl)
                })
                setDistributionRevenueLabels(labels.map(n => monatNamen[n-1]))
                setDistributionRevenueValues(data)
            })
    },[])

    useEffect(() => {
        StatistikService.countBuchungPerMonth().then(
            (result:AxiosResponse<[{monat:number, anzahl:number}]>) => {
                let labels: number[] = []
                let data: number[] = []

                result.data.forEach(kd => {
                    labels.push(kd.monat);
                    data.push(kd.anzahl)
                })
                setCountPerMonthLabels(labels.map(n => monatNamen[n-1]))
                setCountPerMonthValues(data)
            })
    },[])



    const data = {
        labels: distributionKategorieLabels,
        datasets:[{
            data:distributionKategorieValues,
            backgroundColor:["purple", "orange","green" ,"blue", "red"]
        }
        ]
    }

    const dataService = {
        labels: distributionServiceLabels,
        datasets:[
            {
                data:distributionServiceValues,
                backgroundColor:["purple", "orange","green" ,"blue", "red"]
            }
        ]
    }

    const dataCountBuchungPerMonth = {
        labels: countPerMonthLabels,
        datasets:[{
            label:"Anzahl Buchungen pro Monat",
            data:countPerMonthValues
        }]
    }

    let meanRevenueValues:number[] = []
    for (let i = 0; i < distributionRevenueValues.length; i++) {
        meanRevenueValues.push(distributionRevenueValues[i]/countPerMonthValues[i])
    }
    const dataRevenue = {
        labels: distributionRevenueLabels,
        datasets:[
            {
                label:"Gesamteinahmen pro Monat",
                data:distributionRevenueValues,
            },
            {
                label:"Durchschnittspreis pro Monat",
                data:meanRevenueValues
            }

        ]
    }

    const optionsLineChar = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

    return <>
            <AdminNavbar/>
            <Box sx={{m:5 ,backgroundColor: 'primary.dark',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                }}} >
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table" align="left">
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' colSpan={kategorien.length*2}>
                                    <h2>Top 5 Vermietungen</h2>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {kategorien.map(k =>
                                    <TableCell colSpan={2} key={k}>
                                    {k.replaceAll("_", " und ")}
                                    </TableCell>)}
                            </TableRow>

                            {materialien.length == 0 ?
                                <TableRow>
                                    <TableCell align='left' style={{paddingLeft: "2.5%"}}>
                                        Statistik konnte noch nicht erstellt werden!
                                    </TableCell>
                                </TableRow>
                                :
                                null
                            }
                        </TableHead>
                        <TableBody>
                            {materialien.map(m => <TableRow>
                                {m.map(pm => pm==undefined?
                                    <>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                    </>
                                    :
                                    <>
                                        <TableCell>{pm.material}</TableCell>
                                        <TableCell>{pm.count}</TableCell>
                                    </>)}
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        <Box sx={{mx:5}}>
            <TableContainer component={Paper}>
                <div className="container">
                    <div className="chart1">
                        <p><b>Aufteilung der Einnahmen nach Kategorie</b></p>
                        <Doughnut data={data} height={2} width={2}/>
                    </div>
                    <div className="chart2">
                        <p><b>Aufteilung der Einnahmen nach Service</b></p>
                        <Doughnut data={dataService} height={2} width={2}/></div>
                </div>
                <div className="container">
                    <div className="chart1">
                        <p><b>Gesamteinnahmen pro Monat</b></p>
                        <Line options={optionsLineChar} data={dataRevenue} height={2} width={2}/></div>
                    <div className="chart1">
                        <p><b>Buchungen pro Monat</b></p>
                        <Line options={optionsLineChar}  data={dataCountBuchungPerMonth} height={2} width={2}/></div>
                </div>
            </TableContainer>
        </Box>
        </>
}
