import {useEffect, useState} from "react";
import MaterialService from "@/services/MaterialService";
import {Material, MaterialPrice} from "@/model/AllTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {AlertDialogFilled} from "@/components/ui/alertDialogFilled";

import * as React from "react";
import {toast} from "sonner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Toaster} from "@/components/ui/sonner";
import { PageShell } from "@/components/PageShell";
import materialService from "@/services/MaterialService";

import { MaterialCreateDropdown, type MaterialDraft, MaterialEditDateDropdown, MaterialEditPriceDropdown } from "@/tabs/materials/PopUps"; // adjust path if different

export const MaterialsOverview = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [materialPrice, setMaterialPrice] = useState<MaterialPrice>();
    const [openMenuId, setOpenMenuId] = useState<number>(0);

    // NEW: hold draft and validity for the create dialog
    const [createDraft, setCreateDraft] = useState<MaterialDraft>({
        name: "",
        count: 0,
        category: undefined,
        dayPrice: 0,
        weekendPrice: 0,
        buildUpPrice: 0,
    });
    const [createValid, setCreateValid] = useState(false);

    useEffect(() => {
        MaterialService.getAll().then((r) => setMaterials(r.data));
    }, []);

    const handleClick = (id: number) => {
        setOpenMenuId(openMenuId === id ? 0 : id);
    };
    const handleClose = () => setOpenMenuId(0);

    // keep a single service import to avoid confusion
    const onCreateOfMaterial = async (material: Material) => {
        try {
            await MaterialService.save(material);
            setMaterials((prevMaterials) => [...prevMaterials, material]);
            toast.success(`Material ${material.name} erfolgreich erstellt.`);
        } catch (error: any) {
            toast.error(`Fehler beim Erstellen von Material: ${error?.response?.data?.message ?? error?.message}`);
            throw error; // keeps dialog open if caller awaits
        }
    };

    const handleMaterialChange = (materialId: number, field: string, value: any) => {
        setMaterials((prevMaterials) =>
            prevMaterials.map((material) => {
                if (material.id === materialId) {
                    return {...material, [field]: value};
                }
                return material;
            })
        );
    };

    const handleClickSaveMaterialPrice = (materialId: number) => {
        if (!materialPrice) return;
        const updatedMaterial = materials.find((m) => m.id === materialId);
        if (!updatedMaterial) return;

        const updatedMaterialWithNewPrice: Material = {
            ...updatedMaterial,
            materialPrices: [materialPrice, ...updatedMaterial.materialPrices],
        };

        setMaterials((prev) =>
            prev.map((m) => (m.id === materialId ? updatedMaterialWithNewPrice : m))
        );
        handleClickSaveMaterial(updatedMaterialWithNewPrice);
    };

    const handleClickSaveMaterial = (materialToSave: Material) => {
        if (!materialToSave) return;
        MaterialService.save(materialToSave)
            .then(() => {
                toast.success(`Material ${materialToSave.name} erfolgreich gespeichert.`);
            })
            .catch((error) => {
                const message = `Fehlerhaftes Angebot für ${materialToSave.name}: \n ${error.response?.data.message}`;
                console.log(message);
                toast.error(message);
            });
    };

    // NEW: called by "Weiter" of the create dialog
    const handleConfirmCreate = async () => {
        if (!createValid) {
            toast.error("Bitte fülle alle Felder korrekt aus.");
            return;
        }

        const newMaterial: Material = {
            name: createDraft.name,
            category: createDraft.category!, // valid ensured by createValid
            count: createDraft.count,
            materialPrices: [
                {
                    dayPrice: createDraft.dayPrice,
                    weekendPrice: createDraft.weekendPrice,
                    buildUpPrice: createDraft.buildUpPrice,
                    startDate: new Date(),
                },
            ],
        };

        await onCreateOfMaterial(newMaterial);

        // optional: reset for next open
        setCreateDraft({
            name: "",
            count: 0,
            category: undefined,
            dayPrice: 0,
            weekendPrice: 0,
            buildUpPrice: 0,
        });
    };

    return (
        <PageShell title="Materialübersicht">
            <Toaster position="top-center" richColors closeButton />
            <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center w-2/12">Name</TableHead>
                        <TableHead className="text-center w-2/12">Tagespreis</TableHead>
                        <TableHead className="text-center w-2/12">Wochenendpreis</TableHead>
                        <TableHead className="text-center w-2/12">Aufbaupreis</TableHead>
                        <TableHead className="text-center w-4/12">Bearbeiten</TableHead>
                        <TableHead className="text-center w-1/12 text-2xl font-bold">
                            {/* IMPORTANT: AlertDialogFilled remains unchanged */}
                            <AlertDialogFilled
                                buttonName={"+"}
                                dialogTitle={"Material hinzufügen"}
                                dialogContent={
                                    <MaterialCreateDropdown
                                        value={createDraft}
                                        onChange={setCreateDraft}
                                        onValidityChange={setCreateValid}
                                    />
                                }
                                handleClickBack={handleClose}
                                handleClickContinue={handleConfirmCreate} // "Weiter" now creates
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {materials.map((material) => (
                        <TableRow key={material.id}>
                            <TableCell className="text-center w-2/12">{material.name}</TableCell>
                            <TableCell className="text-center w-2/12">
                                {material.materialPrices[0].dayPrice} €
                            </TableCell>
                            <TableCell className="text-center w-2/12">
                                {material.materialPrices[0].weekendPrice} €
                            </TableCell>
                            <TableCell className="text-center w-2/12">
                                {material.materialPrices[0].buildUpPrice} €
                            </TableCell>

                            <TableCell className="flex items-center justify-center">
                                <DropdownMenu
                                    open={openMenuId === material.id}
                                    onOpenChange={() => handleClick(material.id!)}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <Pencil1Icon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <AlertDialogFilled
                                                buttonName={"Material anpassen"}
                                                dialogTitle={"Material " + material.name}
                                                dialogContent={
                                                    <MaterialEditDateDropdown
                                                        materialId={material.id!}
                                                        name={material.name}
                                                        category={material.category}
                                                        count={material.count}
                                                        onChange={handleMaterialChange}
                                                    />
                                                }
                                                handleClickBack={handleClose}
                                                handleClickContinue={() => handleClickSaveMaterial(material)}
                                            />
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <AlertDialogFilled
                                                buttonName={"Preise anpassen"}
                                                dialogTitle={"Material " + material.name}
                                                dialogContent={
                                                    <MaterialEditPriceDropdown
                                                        oldPriceAsHint={material.materialPrices[0]}
                                                        setMaterialPrice={setMaterialPrice}
                                                    />
                                                }
                                                handleClickBack={handleClose}
                                                handleClickContinue={() =>
                                                    handleClickSaveMaterialPrice(material.id!)
                                                }
                                            />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>

                            <TableCell />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </PageShell>
    );
};
