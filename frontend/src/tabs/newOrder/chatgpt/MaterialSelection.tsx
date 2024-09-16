import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MaterialTable from "@/components/ui/material-table";
import {MaterialAvailability, BookingMaterial, categoryValues} from "@/model/AllTypes";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {Button} from "@/components/ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {DateRange} from "react-day-picker";

interface MaterialSelectionProps {
    availableMaterials: MaterialAvailability[];
    bookedMaterials: BookingMaterial[];
    setBookedMaterials: React.Dispatch<React.SetStateAction<BookingMaterial[]>>;
    dateRange:  DateRange | undefined;
    setDateRange:  React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    handlePrev: () => void;
    handleNext: () => void;
}

export const MaterialSelection: React.FC<MaterialSelectionProps> = ({
                                                                        availableMaterials,
                                                                        bookedMaterials,
                                                                        setBookedMaterials,
                                                                        dateRange,
                                                                        setDateRange,
                                                                        handlePrev,
                                                                        handleNext
                                                                    }) => {
    const handleInputChangeBookedMaterial = (materialId: number, newQuantity: number) => {
        setBookedMaterials((prevMaterials) =>
            prevMaterials.map((material) =>
                material.material.id === materialId
                    ? {...material, quantity: newQuantity}
                    : material
            )
        );
        console.log("bookedMaterials updated:", bookedMaterials);
    };

    return (
        <>
            <div className="flex flex-1 items-center space-x-2">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
                {dateRange!.to && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setDateRange({
                                from: undefined,
                                to: undefined,
                            });
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Zurücksetzen
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <Card style={{ marginTop: "20px", marginBottom: "20px", flex: 1 }}>
                <CardHeader>
                    <CardTitle>Bestellung</CardTitle>
                </CardHeader>
                <CardContent style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Tabs defaultValue="Zelte" className="w-full h-full">
                        <TabsList>
                            <TabsTrigger value="Zelte">Zelte</TabsTrigger>
                            <TabsTrigger value="Tische_Bänke_Stühle">Tische & Bänke</TabsTrigger>
                            <TabsTrigger value="Licht_Schatten">Licht & Schatten</TabsTrigger>
                            <TabsTrigger value="Wärme_Kälte">Wärme & Kälte</TabsTrigger>
                            <TabsTrigger value="Aktivitäten">Aktivitäten</TabsTrigger>
                        </TabsList>
                        <div style={{ flex: 1 }}>
                            {categoryValues.map((categoryName) => (
                                <TabsContent key={categoryName} value={categoryName} className="w-full h-full">
                                    <MaterialTable
                                        availableMaterials={availableMaterials.filter(
                                            (m) => m.material.category === categoryName
                                        )}
                                        bookedMaterials={bookedMaterials}
                                        handleInputChangeBookedMaterial={handleInputChangeBookedMaterial}
                                    />
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                    <div className={"button-container2"} style={{paddingTop: "20px"}}>
                        <Button onClick={handlePrev} style={{ marginRight: "20px"}}>Zurück</Button>
                        <Button onClick={handleNext}>Weiter</Button>
                    </div>
                </CardContent>
            </Card>

        </>
    );
};
