import React, {ChangeEvent} from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {BookingMaterial, MaterialAvailability} from "@/model/AllTypes";


interface WarehouseTableProps {
    availableMaterials: MaterialAvailability[];
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({
                                                         availableMaterials,
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
                    return(<TableRow key={availableMaterial.material.id}>
                        <TableCell className="font-semibold w-[100px]">{availableMaterial.material.name}</TableCell>
                        <TableCell className="font-semibold w-[350px]">
                            <Input id={`material-quantity-${availableMaterial.material.name}`}
                                   value={availableMaterial.availableCount} readOnly />
                        </TableCell>
                    </TableRow>)
                })}
            </TableBody>
        </Table>
    );
};

export default WarehouseTable;
