import axios from "axios";
import {Booking, SetupService, LoadingFee, CostDetails} from "@/model/AllTypes";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/booking";

async function getAll(): Promise<Booking[]> {
    try {
        const response = await axios.get<Booking[]>(BUCHUNG_API_BASE_URL + "/getAll");
        console.log("angekommen", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Error fetching bookings: ${error.response.data}`);
        } else {
            throw new Error(`Unexpected error: ${error}`);
        }
    }
}

async function getBuchung (id: number) : Promise<Booking> {
    try {
        const response = await axios.get<Booking>(BUCHUNG_API_BASE_URL + `/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Error fetching booking with id ${id}: ${error.response.data}`);
        } else {
            throw new Error(`Unexpected error: ${error}`);
        }
    }
}

async function getBookingsByStartDate(startDate: Date): Promise<Booking[]> {
    try {
        const response = await axios.get<Booking[]>(`${BUCHUNG_API_BASE_URL}/byStartDate`, {
            params: { startDate }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Error fetching bookings with start date ${startDate}: ${error.response.data}`);
        } else {
            throw new Error(`Unexpected error: ${error}`);
        }
    }
}

async function getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
        const response = await axios.get<Booking[]>(`${BUCHUNG_API_BASE_URL}/byDateRange`, {
            params: {startDate, endDate }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Error fetching bookings between ${startDate} and ${endDate}: ${error.response.data}`);
        } else {
            throw new Error(`Unexpected error: ${error}`);
        }
    }
}

function formatDateToLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}


const writeToExcel = (id:number) => {
    return axios.put(BUCHUNG_API_BASE_URL +`/insertIntoExcel/${id}`);
}

const save = (buchung: Booking) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/add`, buchung);
};

async function  addAufbauService  (id: number, aufbauservice:SetupService[])  {
    console.log("jetzt soll Servce hinzugefügt werden")
    return await axios.put(BUCHUNG_API_BASE_URL + `/addAufbauService/${id}`, aufbauservice)
}

async function deleteAufbauService (id: number) {
    return await axios.delete(BUCHUNG_API_BASE_URL + `/deleteAufbauService/${id}`)
}

async function getAufbauService(id: number) {
    return await axios.get(BUCHUNG_API_BASE_URL + `/getAufbauService/${id}`)
}

async function getLadepauschale(id: number) {
    return await axios.get(BUCHUNG_API_BASE_URL + `/getLadepauschale/${id}`)
}

async function addLadepauschale(id: number, ladepauschale: LoadingFee) {
    console.log("übergebene loadingFee",ladepauschale)
    return await axios.put(BUCHUNG_API_BASE_URL + `/addLadepauschale/${id}`,ladepauschale)
}

async function saveAll (buchungen: Booking[]) {
    return await axios.post(BUCHUNG_API_BASE_URL +`/addAll`, buchungen);
}

async function update (buchung: Booking) {
    return await axios.put(BUCHUNG_API_BASE_URL +`/update`, buchung);
}

async function deleteBuchung (id: number) {
    return await axios.delete(BUCHUNG_API_BASE_URL +`/${id}`);
}

async function getMaterialienFromBuchung (id: number) {
    return await axios.get(BUCHUNG_API_BASE_URL +`/getMaterialien/${id}`);
}

async function countBuchungByStatus (status: string) {
    let year = new Date().getFullYear();
    return await axios.get(BUCHUNG_API_BASE_URL +`/count/${status}/${year}`);
}

async function getByDate (startdatum: Date, enddatum: Date) {
    return await axios.get(BUCHUNG_API_BASE_URL +`/getByDatum`,
        {
            params: {startDate:startdatum.toLocaleDateString('en-CA'), endDate:enddatum.toLocaleDateString('en-CA') }
        })
}

async function getIncome(){
    return await axios.get(BUCHUNG_API_BASE_URL +`/income`)
}

async function incomePerMonthPerYear(){
    return await axios.get(BUCHUNG_API_BASE_URL +`/incomePerMonthPerYear`)
}

async function countBuchungPerMonthPerYear(){
    return await axios.get(BUCHUNG_API_BASE_URL +`/countBuchungPerMonthPerYear`)
}

async function incomePerMonth(){
    return await axios.get(BUCHUNG_API_BASE_URL +`/incomePerMonth`)
}

async function createInvoice(id:number, rechnungsdatum:Date, leistungsdatum:Date, begleichsdatum:Date) {
    return await axios.post(BUCHUNG_API_BASE_URL +`/createInvoice/${id}`,
        {"invoiceDate":rechnungsdatum, "serviceDate":leistungsdatum, "paymentDate":begleichsdatum});
}

async function createOffer(id:number, infos:CostDetails, validUntil:Date) {
    await axios.post(BUCHUNG_API_BASE_URL +`/createOffer/${id}`,
        {"countDailyRent":infos.countDailyRent, "countWeekendRent":infos.countWeekendRent,
            "deliveryCosts":infos.deliveryCosts, "validUntil":validUntil});
}

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
