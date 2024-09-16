import axios from "axios";

const BUCHUNG_API_BASE_URL = "http://localhost:8080/statistik";


const topFiveItems = () => {
    return axios.get(BUCHUNG_API_BASE_URL+"/topFiveItems")
}

const distributionKategorie = () => {
    return axios.get(BUCHUNG_API_BASE_URL+"/distributionKategorie")
}

const distributionRevenue = () => {
    return axios.get(BUCHUNG_API_BASE_URL+"/distributionRevenue")
}

const distributionService = () => {
    return axios.get(BUCHUNG_API_BASE_URL+"/distributionService")

}

const countBuchungPerMonth = () => {
    return axios.get(BUCHUNG_API_BASE_URL+"/countBuchungPerMonth")

}

const StatistikService = {
    topFiveItems,
    distributionKategorie,
    distributionService,
    distributionRevenue,
    countBuchungPerMonth
};
export default StatistikService;
