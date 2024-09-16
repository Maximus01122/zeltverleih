import axios from "axios";
import {Material} from "@/model/AllTypes";

const MATERIAL_API_BASE_URL = "http://localhost:8080/material";

async function getAll() {
    let materialien: Material[] = [];
    return  axios.get(MATERIAL_API_BASE_URL + "/getAll")
    /*    .then((result: any) => {
            result.data.forEach(function (item: Material) {
                materialien.push(item);
            });
        });
    return materialien;*/
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

async function getOccupiedQuantity (startdatum: Date, enddatum: Date) {
    return await axios.get(MATERIAL_API_BASE_URL +`/getOccupiedQuantity`,
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
    getOccupiedQuantity
};
export default MaterialService;
