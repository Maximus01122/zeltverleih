import axios, {AxiosResponse} from "axios";
import {BookingMaterial, PlatzMaterial} from "@/model/AllTypes";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/buchungmaterial";

async function getAll () {
    let bestellung: BookingMaterial[] = [];
    await axios.get(BUCHUNG_API_BASE_URL + "/getAll")
        .then((result: any) => {
            result.data.forEach(function (item: BookingMaterial) {
                bestellung.push(item);
            });
        });
    return bestellung;
}

const get = (id: number) => {
    let request: Promise<AxiosResponse> = axios.get(BUCHUNG_API_BASE_URL +`/get/${id}`);
    return request.then((res: AxiosResponse<BookingMaterial>) => {return  res.data;});
};

const save = (buchungMaterial: BookingMaterial) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/add`, buchungMaterial);
};

const saveAll = (bestellung: BookingMaterial[]) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/addAll`, bestellung);
};

async function checkBestellung (bestellung: PlatzMaterial[], startdatum:Date, enddatum:Date) {
    let isValid: boolean = false;
    await axios.put(BUCHUNG_API_BASE_URL +`/checkBestellung`,
        {"platzMaterialList":bestellung, "startdatum": startdatum, "enddatum": enddatum})
            .then(r => isValid = r.data)
    return isValid;
}

const update = (buchungMaterial: BookingMaterial) => {
    return axios.put(BUCHUNG_API_BASE_URL +`/update`, buchungMaterial);
};

const deleteBuchungMaterial = (id: number) => {
    return axios.delete(BUCHUNG_API_BASE_URL +`/delete/${id}`);
};

const deleteAll = (bestellungOrginal: BookingMaterial[]) => {
    return bestellungOrginal.forEach(bm => axios.delete(BUCHUNG_API_BASE_URL +`/delete/${bm.id}`))
}

const getAllFreePlacesWithoutSelf = (startdatum: Date, enddatum: Date, buchungsID: number) => {
    return axios.put(BUCHUNG_API_BASE_URL+"/getAllFreePlacesWithoutSelf",
        {"startdatum": startdatum, "enddatum": enddatum, "buchungsId": buchungsID})

}

const getAllFreePlaces = (startdatum: Date, enddatum: Date) => {
    return axios.put(BUCHUNG_API_BASE_URL+"/getAllFreePlaces",
        {"startdatum": startdatum, "enddatum": enddatum})

}





const BookingMaterialService = {
    getAll,
    get,
    save,
    saveAll,
    update,
    deleteBuchungMaterial,
    getAllFreePlacesWithoutSelf,
    getAllFreePlaces,
    checkBestellung,
    deleteAll,
};
export default BookingMaterialService;
