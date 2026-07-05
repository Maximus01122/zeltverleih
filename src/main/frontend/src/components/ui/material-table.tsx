import React, { ChangeEvent } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BookingMaterial, MaterialAvailability } from "@/model/AllTypes";

interface MaterialTableProps {
    availableMaterials: MaterialAvailability[];
    bookedMaterials: BookingMaterial[];
    handleInputChangeBookedMaterial: (
        materialId: number,
        newQuantity: number
    ) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
                                                         availableMaterials,
                                                         bookedMaterials,
                                                         handleInputChangeBookedMaterial,
                                                     }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Anzahl</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {availableMaterials.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={2} align="left" style={{ paddingLeft: "2.5%" }}>
                            Wähle zuerst einen Zeitraum aus
                        </TableCell>
                    </TableRow>
                )}

                {availableMaterials.map((availableMaterial) => {
                    const bookedMaterial = bookedMaterials.find(
                        (bm) => bm.material.id === availableMaterial.material.id
                    );

                    return (
                        <TableRow key={availableMaterial.material.id}>
                            <TableCell className="font-semibold min-w-[120px]">
                                {availableMaterial.material.name}
                            </TableCell>

                            <TableCell className="font-semibold min-w-[200px]">
                                <Input
                                    id={`${availableMaterial.material.id}`}
                                    type="number"
                                    min={0}
                                    max={availableMaterial.availableCount}
                                    placeholder="0"
                                    value={bookedMaterial?.quantity ?? ""}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChangeBookedMaterial(
                                            availableMaterial.material.id!,
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default MaterialTable;
