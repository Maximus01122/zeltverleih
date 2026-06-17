// File: StepMaterialSelection.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MaterialTable from "@/components/ui/material-table";
import { MaterialAvailability, BookingMaterial, categoryValues } from "@/model/AllTypes";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";

interface StepMaterialSelectionProps {
    availableMaterials: MaterialAvailability[];
    bookedMaterials: BookingMaterial[];
    setBookedMaterials: React.Dispatch<React.SetStateAction<BookingMaterial[]>>;
    dateRange: DateRange | undefined;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    onPrev: () => void;
    onNext: () => void;
}

const StepMaterialSelection: React.FC<StepMaterialSelectionProps> = ({
                                                                         availableMaterials,
                                                                         bookedMaterials,
                                                                         setBookedMaterials,
                                                                         dateRange,
                                                                         setDateRange,
                                                                         onPrev,
                                                                         onNext,
                                                                     }) => {

    const handleInputChangeBookedMaterial = (materialId: number, newQuantity: number) => {
        const quantity = isNaN(newQuantity) ? 0 : newQuantity;
        setBookedMaterials(prev =>
            prev.map(m =>
                m.material.id === materialId ? { ...m, quantity } : m
            )
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
                {dateRange?.to && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange(undefined)}
                        className="h-8"
                    >
                        Zeitraum löschen
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <Card className="border-none shadow-none">
                <CardHeader className="px-0">
                    <CardTitle>Materialauswahl</CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                    <Tabs defaultValue={categoryValues[0]} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto">
                            {categoryValues.map(cat => (
                                <TabsTrigger key={cat} value={cat}>
                                    {cat.replace(/_/g, " ")}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-4 border rounded-md">
                            {categoryValues.map(cat => (
                                <TabsContent key={cat} value={cat} className="m-0">
                                    <MaterialTable
                                        availableMaterials={availableMaterials.filter(
                                            m => m.material.category === cat
                                        )}
                                        bookedMaterials={bookedMaterials}
                                        handleInputChangeBookedMaterial={handleInputChangeBookedMaterial}
                                    />
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>

                    <div className="flex justify-between pt-4">
                        <Button onClick={onPrev} variant="outline">Zurück</Button>
                        <Button onClick={onNext} disabled={!dateRange?.to}>Weiter</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StepMaterialSelection;