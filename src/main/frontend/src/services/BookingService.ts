import axios from "axios";
import {Booking, SetupService, LoadingFee, CostDetails} from "@/model/AllTypes";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/booking";

// Zentrale Fehlerbehandlung
function handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
        console.error(`API Error: ${error.response.data}`);
        throw new Error(`API Error: ${error.response.data}`);
    } else {
        console.error(`Unexpected error: ${error}`);
        throw new Error(`Unexpected error: ${error}`);
    }
}

// 1. getAll - Holt alle Buchungen
const getAll = async (): Promise<Booking[]> => {
    try {
        const response = await axios.get<Booking[]>(BUCHUNG_API_BASE_URL + "/getAll");
        console.log("angekommen", response.data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 2. getBuchung - Holt eine spezifische Buchung nach ID
const getBuchung = async (id: number): Promise<Booking> => {
    try {
        const response = await axios.get<Booking>(BUCHUNG_API_BASE_URL + `/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 3. getBookingsByStartDate - Holt Buchungen nach Startdatum
const getBookingsByStartDate = async (startDate: Date): Promise<Booking[]> => {
    try {
        const response = await axios.get<Booking[]>(`${BUCHUNG_API_BASE_URL}/byStartDate`, {
            params: { startDate }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 4. getBookingsByDateRange - Holt Buchungen nach Datumsbereich
const getBookingsByDateRange = async (startDate: Date, endDate: Date): Promise<Booking[]> => {
    try {
        const response = await axios.get<Booking[]>(`${BUCHUNG_API_BASE_URL}/byDateRange`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// 5. formatDateToLocalDateString - Formatiert ein Datum als lokales Datum
const formatDateToLocalDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// 6. writeToExcel - Schreibt Daten in eine Excel-Datei
const writeToExcel = async (id: number) => {
    try {
        return await axios.put(BUCHUNG_API_BASE_URL + `/insertIntoExcel/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 7. save - Speichert eine Buchung
const save = async (buchung: Booking) => {
    try {
        return await axios.post(BUCHUNG_API_BASE_URL + `/add`, buchung);
    } catch (error) {
        handleError(error);
    }
};

// 8. addAufbauService - Fügt einen Aufbau-Service hinzu
const addAufbauService = async (id: number, aufbauservice: SetupService[]) => {
    try {
        console.log("jetzt soll Service hinzugefügt werden");
        return await axios.put(BUCHUNG_API_BASE_URL + `/addAufbauService/${id}`, aufbauservice);
    } catch (error) {
        handleError(error);
    }
};

// 9. deleteAufbauService - Löscht einen Aufbau-Service
const deleteAufbauService = async (id: number) => {
    try {
        return await axios.delete(BUCHUNG_API_BASE_URL + `/deleteAufbauService/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 10. getAufbauService - Holt den Aufbau-Service einer Buchung
const getAufbauService = async (id: number) => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/getAufbauService/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 11. getLadepauschale - Holt die Ladepauschale einer Buchung
const getLadepauschale = async (id: number) => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/getLadepauschale/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 12. addLadepauschale - Fügt eine Ladepauschale hinzu
const addLadepauschale = async (id: number, ladepauschale: LoadingFee) => {
    try {
        console.log("übergebene loadingFee", ladepauschale);
        return await axios.put(BUCHUNG_API_BASE_URL + `/addLadepauschale/${id}`, ladepauschale);
    } catch (error) {
        handleError(error);
    }
};

// 13. saveAll - Speichert mehrere Buchungen
const saveAll = async (buchungen: Booking[]) => {
    try {
        return await axios.post(BUCHUNG_API_BASE_URL + `/addAll`, buchungen);
    } catch (error) {
        handleError(error);
    }
};

// 14. update - Aktualisiert eine Buchung
const update = async (buchung: Booking) => {
    try {
        return await axios.put(BUCHUNG_API_BASE_URL + `/update`, buchung);
    } catch (error) {
        handleError(error);
    }
};

// 15. deleteBuchung - Löscht eine Buchung nach ID
const deleteBuchung = async (id: number) => {
    try {
        return await axios.delete(BUCHUNG_API_BASE_URL + `/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 16. getMaterialienFromBuchung - Holt Materialien einer Buchung
const getMaterialienFromBuchung = async (id: number) => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/getMaterialien/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// 17. countBuchungByStatus - Zählt Buchungen nach Status
const countBuchungByStatus = async (status: string) => {
    const year = new Date().getFullYear();
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/count/${status}/${year}`);
    } catch (error) {
        handleError(error);
    }
};

// 18. getByDate - Holt Buchungen nach Datum
const getByDate = async (startdatum: Date, enddatum: Date) => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/getByDatum`, {
            params: {
                startDate: startdatum.toLocaleDateString('en-CA'),
                endDate: enddatum.toLocaleDateString('en-CA')
            }
        });
    } catch (error) {
        handleError(error);
    }
};

// 19. getIncome - Holt die Einnahmen
const getIncome = async () => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/income`);
    } catch (error) {
        handleError(error);
    }
};

// 20. incomePerMonthPerYear - Holt die Einnahmen pro Monat und Jahr
const incomePerMonthPerYear = async () => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/incomePerMonthPerYear`);
    } catch (error) {
        handleError(error);
    }
};

// 21. countBuchungPerMonthPerYear - Zählt Buchungen pro Monat und Jahr
const countBuchungPerMonthPerYear = async () => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/countBuchungPerMonthPerYear`);
    } catch (error) {
        handleError(error);
    }
};

// 22. incomePerMonth - Holt die Einnahmen pro Monat
const incomePerMonth = async () => {
    try {
        return await axios.get(BUCHUNG_API_BASE_URL + `/incomePerMonth`);
    } catch (error) {
        handleError(error);
    }
};

// 23. createInvoice - Erstellt eine Rechnung
const createInvoice = async (id: number, rechnungsdatum: Date, leistungsdatum: Date, begleichsdatum: Date) => {
    try {
        return await axios.post(BUCHUNG_API_BASE_URL + `/createInvoice/${id}`, {
            invoiceDate: rechnungsdatum,
            serviceDate: leistungsdatum,
            paymentDate: begleichsdatum
        });
    } catch (error) {
        handleError(error);
    }
};

// 24. createOffer - Erstellt ein Angebot
const createOffer = async (id: number, infos: CostDetails, validUntil: Date) => {
    try {
        await axios.post(BUCHUNG_API_BASE_URL + `/createOffer/${id}`, {
            countDailyRent: infos.countDailyRent,
            countWeekendRent: infos.countWeekendRent,
            deliveryCosts: infos.deliveryCosts,
            validUntil
        });
    } catch (error) {
        handleError(error);
    }
};
// Exporte
const BookingService = {
    getAll,
    getBuchung,
    save,
    update,
    deleteBuchung,
    getMaterialienFromBuchung,
    getByDate,
    createInvoice,
    createOffer,
    addAufbauService,
    deleteAufbauService,
    writeToExcel,
    getLadepauschale,
    getAufbauService,
    addLadepauschale,
    countBuchungByStatus,
    getIncome,
    incomePerMonthPerYear,
    countBuchungPerMonthPerYear,
    getBookingsByStartDate,
    getBookingsByDateRange
};

export default BookingService;
