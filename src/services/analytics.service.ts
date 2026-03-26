import {api} from "./api";
import {unwrap} from "./base";
import {MonthlyAnalytics} from "../types/api.types";

const EMPTY_ANALYTICS: MonthlyAnalytics = {
    totalIncome: 0,
    totalExpense: 0,
    totalInvestment: 0,
    netSavings: 0,
    expenseBreakdown: [],
};

export const analyticsService = {

    async getMonthly(year: number, month: number): Promise<MonthlyAnalytics> {
        const res = await api.get("/analytics/month", {
            params: {year, month},
        });

        return unwrap<MonthlyAnalytics>(res) ?? EMPTY_ANALYTICS;
    },

    async getMonthComparison(year: number, month: number) {
        const res = await api.get("/analytics/month-compare", {
            params: {year, month},
        });

        return unwrap(res) ?? null;
    },

    async getYearly(year: number) {
        const res = await api.get("/analytics/year", {
            params: {year},
        });

        return unwrap(res) ?? {
            total: {
                totalIncome: 0,
                totalExpense: 0,
                totalInvestment: 0,
                netSavings: 0,
            },
            months: [],
        };
    }
};