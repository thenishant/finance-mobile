import {api} from "./api";
import {unwrap} from "./base";
import {MonthlyAnalytics} from "../types/api.types";
import {YearAnalytics} from "../types/analytics";
import {DashboardComparison, DashboardResponse} from "../types/dashboard";

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

    async getMonthComparison(year: number, month: number): Promise<DashboardComparison | null> {
        const res = await api.get("/analytics/month-compare", {
            params: {year, month},
        });
        return unwrap<DashboardComparison>(res) ?? null;
    },

    async getDashboard(year: number, month: number): Promise<DashboardResponse> {
        const res = await api.get("/analytics/dashboard", {
            params: {
                year,
                month,
            },
        });

        return unwrap<DashboardResponse>(res);
    },

    async getYearly(year: number): Promise<YearAnalytics> {
        const res = await api.get("/analytics/year", {
            params: {year},
        });

        return unwrap<YearAnalytics>(res) ?? {
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

