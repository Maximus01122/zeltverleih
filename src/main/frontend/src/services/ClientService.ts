import {Client} from "@/model/AllTypes";
import axios from "axios";
import {apiUrl} from "@/services/api";

const CLIENT_API_BASE_URL = apiUrl("/client");


const add  = (kunde: Client) => {
    return axios.post<Client>(CLIENT_API_BASE_URL + "/add", kunde);
}

const update  = (kunde: Client) => {
    return axios.put<Client>(CLIENT_API_BASE_URL + "/update", kunde);
}

const getAll = () => {
    return axios.get(CLIENT_API_BASE_URL + "/getAll");
};

const get = (id: number) => {
    return axios.get(CLIENT_API_BASE_URL +`/get/${id}`);
};

const getByName = (name: String) => {
    return axios.get(CLIENT_API_BASE_URL +`/getByName/${name}`);
};

const ClientService = {
    getAll,
    get,
    update,
    add,
    getByName
};
export default ClientService;
