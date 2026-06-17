import axios from "axios";
import {MonthlyRevenueRow} from "@/model/AllTypes";
import {apiUrl} from "@/services/api";

const STATS_API_BASE_URL = apiUrl("/statistik");


const topFiveItems = () => {
    return axios.get(STATS_API_BASE_URL+"/topFiveItems")
}

const distributionKategorie = () => {
    return axios.get(STATS_API_BASE_URL+"/distributionKategorie")
}

const distributionRevenue = () => {
    return axios.get(STATS_API_BASE_URL+"/distributionRevenue")
}

const distributionService = () => {
    return axios.get(STATS_API_BASE_URL+"/distributionService")

}

const countBuchungPerMonth = () => {
    return axios.get(STATS_API_BASE_URL+"/countBuchungPerMonth")

}

const getMonthlyRevenue = async (): Promise<MonthlyRevenueRow[]> => {
        const res = await axios.get<MonthlyRevenueRow[]>(`${STATS_API_BASE_URL}/revenue/monthly`);
        return res.data;
};

const getIncome = async () => {
    return await axios.get(`${STATS_API_BASE_URL}/income`);
};

const StatistikService = {
    topFiveItems,
    distributionKategorie,
    distributionService,
    distributionRevenue,
    countBuchungPerMonth,
    getMonthlyRevenue,
    getIncome
};
export default StatistikService;
