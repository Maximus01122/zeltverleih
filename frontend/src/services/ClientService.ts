import {Client} from "@/model/AllTypes";
import axios from "axios";

const CLIENT_API_BASE_URL = "http://localhost:8080/client";


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
