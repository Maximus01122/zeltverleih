import axios from "axios";
import {Material} from "@/model/AllTypes";
import {apiUrl} from "@/services/api";

const MATERIAL_API_BASE_URL = apiUrl("/material");

async function getAll() {
    return  axios.get(MATERIAL_API_BASE_URL + "/getAll")
}

const getMaterial = (id: number) => {
    return axios.get(MATERIAL_API_BASE_URL +`/get/${id}`);
};

const save = (buchung: Material) => {
    return axios.post(MATERIAL_API_BASE_URL +`/add`, buchung);
};

const saveAll = (materialien: Material[]) => {
    return axios.post(MATERIAL_API_BASE_URL +`/addAll`, materialien);
};

const update = (material: Material) => {
    return axios.put(MATERIAL_API_BASE_URL +`/update`, material);
};

const deleteMaterial = (id: number) => {
    return axios.delete(MATERIAL_API_BASE_URL +`/delete/${id}`);
};

const getByKategorie = (kategorie:String) => {
    return axios.get(MATERIAL_API_BASE_URL + `/getByKategorie/${kategorie}`);
};

const getKategorien = () => {
    return axios.get(MATERIAL_API_BASE_URL + `/getKategorien/`);
};

async function getAvailableQuantity (startdatum: Date, enddatum: Date) {
    return await axios.get(MATERIAL_API_BASE_URL +`/getAvailableQuantity`,
        {
            params: {startDate:startdatum.toISOString().split('T')[0], endDate:enddatum.toISOString().split('T')[0] }
        })
}

const MaterialService = {
    getAll,
    getMaterial,
    save,
    saveAll,
    update,
    deleteMaterial,
    getKategorien,
    getByKategorie,
    getAvailableQuantity
};
export default MaterialService;
