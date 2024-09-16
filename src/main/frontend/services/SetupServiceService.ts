import axios from "axios";
import {SetupService} from "@/model/AllTypes";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/service";

async function getAll () {
    let aufbauService: SetupService[] = [];
    await axios.get(BUCHUNG_API_BASE_URL + "/getAll")
        .then((result: any) => {
            result.data.forEach(function (item: SetupService) {
                aufbauService.push(<SetupService> item);
            });
        });
    return aufbauService;
}


const get = (id: number) => {
    return axios.get(BUCHUNG_API_BASE_URL +`/get/${id}`);
};

const save = (aufbauService: SetupService) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/add`, aufbauService);
};

const saveAll = (aufbauService: SetupService[]) => {
    return axios.post(BUCHUNG_API_BASE_URL +`/addAll`, aufbauService);
};

const update = (aufbauService: SetupService) => {
    return axios.put(BUCHUNG_API_BASE_URL +`/update`, aufbauService);
};

const deleteLadepauschale = (id: number) => {
    return axios.delete(BUCHUNG_API_BASE_URL +`/delete/${id}`);
};

const getByName = (name:string) => {
    return axios.get(BUCHUNG_API_BASE_URL +`/getByName/${name}`);
}

const getHufeisenwerfen = () => {
    return getByName("Hufeisenwerfen");
}


const SetupServiceService = {
    getAll,
    get,
    save,
    saveAll,
    update,
    deleteLadepauschale,
    getByName,
    getHufeisenwerfen
};
export default SetupServiceService;
