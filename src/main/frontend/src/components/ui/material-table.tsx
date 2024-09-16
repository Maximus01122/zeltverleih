import React, {ChangeEvent} from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {BookingMaterial, MaterialAvailability} from "@/model/AllTypes";


interface MaterialTableProps {
    availableMaterials: MaterialAvailability[];
    bookedMaterials: BookingMaterial[];
    handleInputChangeBookedMaterial: (materialId: number, newQuantity: number) => void;
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
                {availableMaterials.length === 0 ? (
                    <TableRow>
                        <TableCell align="left" style={{ paddingLeft: "2.5%" }}>
                            Wähle zuerst einen Zeitraum aus
                        </TableCell>
                    </TableRow>
                ) : null}
                {availableMaterials.map((availableMaterial) => {
                    const bookedMaterial = bookedMaterials.find(
                        (bm) => bm.material.id === availableMaterial.material.id
                    );
                    return (
                        <TableRow key={availableMaterial.material.id}>
                            <TableCell className="font-semibold w-[100px]">
                                {availableMaterial.material.name}
                            </TableCell>
                            <TableCell className="font-semibold w-[350px]">
                                <Input
                                    id={`${availableMaterial.material.id}`}
                                    type={"number"}
                                    min={0}
                                    max={availableMaterial.availableCount}
                                    placeholder={"0"}
                                    value={bookedMaterial?.quantity || 0}
                                    onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                        handleInputChangeBookedMaterial(
                                            availableMaterial.material.id!,
                                            parseInt(e.target.value)
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
