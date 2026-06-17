import {Category, categoryValues, Material, MaterialPrice} from "@/model/AllTypes";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {de} from "date-fns/locale";
import {useEffect, useState} from "react";

interface MaterialEditDateDropdownProps {
    materialId: number;
    name: string;
    category?: Category;
    count: number;
    onChange: (materialId: number, field: string, value: any) => void;
}

export const MaterialEditDateDropdown = ({
                                             materialId,
                                             name,
                                             category,
                                             count,
                                             onChange,
                                         }: MaterialEditDateDropdownProps) => {
    return (
        <div className="grid items-center justify-center gap-3">
            <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => onChange(materialId, "name", e.target.value)}
            />
            <Input
                type="number"
                placeholder="Anzahl"
                value={count}
                min={0}
                onChange={(e) => onChange(materialId, "count", Number(e.target.value))}
            />
            <Select value={category} onValueChange={(value) => onChange(materialId, "category", value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category"/>
                </SelectTrigger>
                <SelectContent>
                    {categoryValues.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category.replaceAll('_', ' ')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};


interface MaterialEditPriceDropdownProps {
    oldPriceAsHint: MaterialPrice,
    setMaterialPrice: React.Dispatch<React.SetStateAction<MaterialPrice | undefined>>
}

export const MaterialEditPriceDropdown = ({
                                              oldPriceAsHint,
                                              setMaterialPrice
                                          }: MaterialEditPriceDropdownProps) => {

    const [newPrice, setNewPrice] = useState<MaterialPrice>({...oldPriceAsHint, id: undefined});

    const handleNewPriceChange = (key: keyof MaterialPrice, value: any) => {
        const updatedPrice = {...newPrice, [key]: value};
        setNewPrice(updatedPrice);
        setMaterialPrice(updatedPrice);
    };

    return (
        <div className="grid items-center justify-center gap-3">
            <Input
                type="number"
                placeholder={`Tagespreis (zuvor ${oldPriceAsHint.dayPrice}€)`}
                min={0}
                onChange={(e) => handleNewPriceChange("dayPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder={`Wochenendpreis (zuvor ${oldPriceAsHint.weekendPrice}€)`}
                min={0}
                onChange={(e) => handleNewPriceChange("weekendPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder={`Aufbaupreis (zuvor ${oldPriceAsHint.buildUpPrice}€)`}
                min={0}
                onChange={(e) => handleNewPriceChange("buildUpPrice", Number(e.target.value))}
            />
            <div>Preis gültig ab:</div>
            <Calendar
                locale={de}
                mode="single"
                selected={newPrice.startDate}
                onSelect={(date) => date && handleNewPriceChange("startDate", date)}
                className="rounded-md border"
            />
        </div>
    );
};


/** NEW: a typed draft the parent controls */
export type MaterialDraft = {
    name: string;
    count: number;
    category?: Category;
    dayPrice: number;
    weekendPrice: number;
    buildUpPrice: number;
};

type MaterialCreateDropdownProps = {
    value: MaterialDraft;
    onChange: (next: MaterialDraft) => void;
    onValidityChange?: (valid: boolean) => void;
};

export const MaterialCreateDropdown: React.FC<MaterialCreateDropdownProps> = ({
                                                                                    value,
                                                                                    onChange,
                                                                                    onValidityChange,
                                                                                }) => {
    const set = <K extends keyof MaterialDraft>(k: K, v: MaterialDraft[K]) =>
        onChange({ ...value, [k]: v });

    const isValid =
        !!value.name &&
        !!value.category &&
        Number.isFinite(value.count) &&
        value.count > 0 &&
        value.dayPrice >= 0 &&
        value.weekendPrice >= 0 &&
        value.buildUpPrice >= 0;

    useEffect(() => {
        onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    return (
        <div className="grid items-center justify-center gap-3">
            <Input
                type="text"
                placeholder="Name Material"
                value={value.name}
                onChange={(e) => set("name", e.target.value)}
            />
            <Input
                type="number"
                placeholder="Anzahl"
                min={0}
                onChange={(e) => set("count", Number(e.target.value))}
            />
            <Select value={value.category} onValueChange={(v) => set("category", v as Category)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wähle eine Kategorie" />
                </SelectTrigger>
                <SelectContent>
                    {categoryValues.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category.replaceAll("_", " ")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                type="number"
                placeholder="Tagespreis"
                min={0}
                onChange={(e) =>
                    set("dayPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder="Wochenendpreis"
                min={0}
                onChange={(e) => set("weekendPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder="Aufbaupreis"
                min={0}
                onChange={(e) => set("buildUpPrice", Number(e.target.value))}
            />
        </div>
    );
};
