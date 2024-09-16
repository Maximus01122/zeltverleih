import {Address, SetupServiceName, Client, MaterialAvailability, Material, BookingMaterial} from "@/model/AllTypes";

function formatSetupServiceName(name: SetupServiceName): string {
    // Split at underscores, convert to lowercase, and capitalize first letter
    return name.split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

function addMaterialLists(list1:Material[], list2:Material[]
) {
    const result: { [key: number]: Material } = {};

    [...list1, ...list2].forEach(material => {
        const id = material.id!;
        result[id] = result[id]
            ? { ...result[id], count: result[id].count + material.count }
            : { ...material };
    });

    return Object.values(result);
}

function addMaterialAvailabilityLists(list1:BookingMaterial[], list2:BookingMaterial[]) {
    const result: { [key: number]: BookingMaterial } = {};

    [...list1, ...list2].forEach(({ material, quantity }) => {
        const id = material.id!;
        result[id] = result[id]
            ? { ...result[id], quantity: result[id].quantity + quantity }
            : { material, quantity };
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

export {
    getEmptyKunde,
    AdresseToString,
    numberWithCommas,
    formatSetupServiceName,
    addMaterialLists,
    addMaterialAvailabilityLists
}
