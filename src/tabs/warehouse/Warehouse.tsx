import React, { useEffect, useState } from "react";
import "../newOrder/FormContactDetails.css";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialService from "@/services/MaterialService";
import {categoryValues, MaterialAvailability} from "@/model/AllTypes";
import Menu from "@/tabs/navigation/menuNew";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import WarehouseTable from "@/tabs/warehouse/WarehouseTable";

export function Warehouse() {
    const [materials, setMaterials] = useState<MaterialAvailability[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            console.log("selected date", dateRange.from, dateRange.to);
            MaterialService.getOccupiedQuantity(dateRange.from, dateRange.to)
                .then((result: any) => {
                    console.log("nach parsen", result.data);
                    setMaterials(result.data);
                })
                .catch((error: any) => {
                    console.error("Error fetching material data:", error);
                });
        }
    }, [dateRange]);

    return (
        <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
                <Menu/>
            </div>
            <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                    <CardTitle>Lager</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="Zelte" className="w-full h-full">
                        <TabsList>
                            <TabsTrigger value="Zelte">Zelte</TabsTrigger>
                            <TabsTrigger value="Tische_Bänke_Stühle">Tische & Bänke</TabsTrigger>
                            <TabsTrigger value="Licht_Schatten">Licht & Schatten</TabsTrigger>
                            <TabsTrigger value="Wärme_Kälte">Wärme & Kälte</TabsTrigger>
                            <TabsTrigger value="Aktivitäten">Aktivitäten</TabsTrigger>
                        </TabsList>
                        <div style={{ flex: 1 }}>
                            {categoryValues.map((categoryName) =>
                                <TabsContent value={categoryName} className="w-full h-full">
                                    <WarehouseTable
                                        availableMaterials={materials.filter(m => m.material.category == categoryName)}
                                    />
                                </TabsContent>
                            )}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
