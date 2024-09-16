import {LoadingFee} from "@/model/AllTypes";
import axios from "axios";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/ladepauschale";

async function getAll () {
    let ladepauschalen: LoadingFee[] = [];
    await axios.get(BUCHUNG_API_BASE_URL + "/getAll")
        .then((result: any) => {
            result.data.forEach(function (item: LoadingFee) {
                ladepauschalen.push(item);
            });
        });
    return ladepauschalen;
}

const get = (id: number) => {
    return axios.get(BUCHUNG_API_BASE_URL +`/get/${id}`);
};

const save = (ladepauschale: LoadingFee) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/add`, ladepauschale);
};

const saveAll = (ladepauschalen: LoadingFee[]) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/addAll`, ladepauschalen);
};

const update = (ladepauschale: LoadingFee) => {
    return axios.put(BUCHUNG_API_BASE_URL +`/update`, ladepauschale);
};

const deleteLadepauschale = (id: number) => {
    return axios.delete(BUCHUNG_API_BASE_URL +`/delete/${id}`);
};


const LadepauschaleService = {
    getAll,
    get,
    save,
    saveAll,
    update,
    deleteLadepauschale,
};
export default LadepauschaleService;
