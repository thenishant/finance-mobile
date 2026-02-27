import {api} from "./api";
import {MonthlyAnalytics} from "../types/api.types";

export const analyticsService = {
    async getMonthly(year: number, month: number): Promise<MonthlyAnalytics> {
        const response = await api.get(
            `/analytics/month?year=${year}&month=${month}`
        );

        return response.data.data;
    },

    async getMonthComparison(year: number, month: number) {
        const response = await api.get(
            `/analytics/month-compare?year=${year}&month=${month}`
        );

        return response.data.data;
    }
};