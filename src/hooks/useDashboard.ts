import {useQuery} from "@tanstack/react-query";
import {analyticsService} from "../services/analytics.service";

export const useDashboard = (year: number, month: number) => {
    return useQuery({
        queryKey: ["dashboard", year, month],

        queryFn: async () => {
            const [monthly, comparison] = await Promise.all([
                analyticsService.getMonthly(year, month),
                analyticsService.getMonthComparison(year, month),
            ]);

            return {monthly, comparison};
        },

        staleTime: 1000 * 60 * 5,   // 5 minutes
        retry: 2,
        refetchOnReconnect: true,
        refetchOnMount: true,
    });
};