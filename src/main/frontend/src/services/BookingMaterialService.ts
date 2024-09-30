import axios, {AxiosResponse} from "axios";
import {BookingMaterial, PlatzMaterial} from "@/model/AllTypes";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/buchungmaterial";

function handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
        console.error(`API Error: ${error.response.data}`);
        throw new Error(`API Error: ${error.response.data}`);
    } else {
        console.error(`Unexpected error: ${error}`);
        throw new Error(`Unexpected error: ${error}`);
    }
}

// 1. getAll - Holt alle Buchungsmaterialien
const getAll = async (): Promise<BookingMaterial[]> => {
    try {
        const response = await axios.get(BUCHUNG_API_BASE_URL + "/getAll");
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 2. get - Holt ein spezifisches Buchungsmaterial nach ID
const get = async (id: number): Promise<BookingMaterial> => {
    try {
        const response = await axios.get(BUCHUNG_API_BASE_URL + `/get/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 3. save - Speichert ein neues Buchungsmaterial
const save = async (buchungMaterial: BookingMaterial): Promise<void> => {
    try {
        await axios.post(BUCHUNG_API_BASE_URL + `/add`, buchungMaterial);
    } catch (error) {
        handleError(error);
    }
};

// 4. saveAll - Speichert mehrere Buchungsmaterialien
const saveAll = async (bestellung: BookingMaterial[]): Promise<void> => {
    try {
        await axios.post(BUCHUNG_API_BASE_URL + `/addAll`, bestellung);
    } catch (error) {
        handleError(error);
    }
};

// 5. checkBestellung - Überprüft, ob eine Bestellung gültig ist
const checkBestellung = async (bestellung: PlatzMaterial[], startdatum: Date, enddatum: Date): Promise<boolean> => {
    try {
        const response = await axios.put(BUCHUNG_API_BASE_URL + `/checkBestellung`, {
            platzMaterialList: bestellung,
            startdatum: startdatum,
            enddatum: enddatum
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 6. update - Aktualisiert ein bestehendes Buchungsmaterial
const update = async (buchungMaterial: BookingMaterial): Promise<void> => {
    try {
        await axios.put(BUCHUNG_API_BASE_URL + `/update`, buchungMaterial);
    } catch (error) {
        handleError(error);
    }
};

// 7. deleteBuchungMaterial - Löscht ein Buchungsmaterial nach ID
const deleteBuchungMaterial = async (id: number): Promise<void> => {
    try {
        await axios.delete(BUCHUNG_API_BASE_URL + `/delete/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 8. deleteAll - Löscht mehrere Buchungsmaterialien
const deleteAll = async (bestellungOrginal: BookingMaterial[]): Promise<void> => {
    try {
        const deletePromises = bestellungOrginal.map(bm => axios.delete(BUCHUNG_API_BASE_URL + `/delete/${bm.id}`));
        await Promise.all(deletePromises);
    } catch (error) {
        handleError(error);
    }
};

// 9. getAllFreePlacesWithoutSelf - Holt alle freien Plätze außer sich selbst
const getAllFreePlacesWithoutSelf = async (startdatum: Date, enddatum: Date, buchungsID: number): Promise<any> => {
    try {
        const response = await axios.put(BUCHUNG_API_BASE_URL + "/getAllFreePlacesWithoutSelf", {
            startdatum: startdatum,
            enddatum: enddatum,
            buchungsId: buchungsID
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 10. getAllFreePlaces - Holt alle freien Plätze
const getAllFreePlaces = async (startdatum: Date, enddatum: Date): Promise<any> => {
    try {
        const response = await axios.put(BUCHUNG_API_BASE_URL + "/getAllFreePlaces", {
            startdatum: startdatum,
            enddatum: enddatum
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

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
