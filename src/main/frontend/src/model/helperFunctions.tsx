import {Address, SetupServiceName, Client, MaterialAvailability, Material, BookingMaterial} from "@/model/AllTypes";

function formatSetupServiceName(name: SetupServiceName): string {
    // Split at underscores, convert to lowercase, and capitalize first letter
    return name.split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

function convertToUTC (date:Date){
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
}

function addBookingMaterialLists(list1:BookingMaterial[], list2:BookingMaterial[]) {
    const result: { [key: number]: BookingMaterial } = {};
    [...list1, ...list2].forEach(({ material, quantity }) => {
        const id = material.id!;
        result[id] = result[id]
            ? { ...result[id], quantity: result[id].quantity + quantity }
            : { material, quantity };
    });
    return Object.values(result);
}

function addMaterialAvailabilityLists(
    list1: BookingMaterial[],
    list2: MaterialAvailability[]
): MaterialAvailability[] {
    const result: { [key: number]: MaterialAvailability } = {};

    // Zuerst die Einträge aus list2 in das Ergebnis übernehmen
    list2.forEach(({ material, availableCount }) => {
        const id = material.id!;
        result[id] = { material, availableCount };
    });

    // Nun die Werte aus list1 hinzufügen oder summieren
    list1.forEach(({ material, quantity }) => {
        const id = material.id!;
        if (result[id]) {
            result[id].availableCount += quantity;
        } else {
            result[id] = { material, availableCount: quantity };
        }
    });

    return Object.values(result);
}

function getEmptyKunde() {
    return {
        id: 0,
        email: "",
        name: "",
        phoneNumber: "",
        customerNumber: 0,
        address: {
            street: "",
            houseNumber: "string",
            city: "",
            postalCode: ""
        }
    }
}

function stringEmptySpace(s:string):string{
    return s==="" ? s : s+" ";
}

function AdresseToString(obj:Client|Address) {
    let adresse:Address;
    if ("name" in obj) {
        adresse = obj.address
    }
    else {adresse = obj}
    let s:string = stringEmptySpace(adresse.street) +
        stringEmptySpace(adresse.houseNumber)

    let sh:string = stringEmptySpace(adresse.postalCode) +
        stringEmptySpace(adresse.city)

    if (s.length>0 && sh.length>0)
        s = s + ", " + sh
    else if(sh.length>0)
        s=sh;
    return s;
}

function numberWithCommas(x:number) {
    let fixed = x.toFixed(2)
    let s = fixed.replace(".",",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (!s.includes(",")){
        s += ",00"
    }
    return s;
}

/** Shared options so both date formatters are consistent. */
const DE_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: '2-digit', month: '2-digit', year: 'numeric',
};

/** Formats a single date in German locale (dd.mm.yyyy). */
function formatDateDE(date: Date | string): string {
    return new Date(date).toLocaleDateString('de-DE', DE_DATE_FORMAT);
}

/** Formats a start–end date range in German locale. */
function formatDateRangeDE(start: Date | string, end: Date | string): string {
    return `${formatDateDE(start)} - ${formatDateDE(end)}`;
}

export {
    getEmptyKunde,
    AdresseToString,
    numberWithCommas,
    formatDateDE,
    formatDateRangeDE,
    formatSetupServiceName,
    addBookingMaterialLists,
    addMaterialAvailabilityLists,
    convertToUTC
}
