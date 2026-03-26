// hooks/useYearAnalytics.ts
import {useQuery} from "@tanstack/react-query";
import {analyticsService} from "../services/analytics.service";

export const useYearAnalytics = (year: number) => {
    return useQuery({
        queryKey: ["analytics-year", year],
        queryFn: () => analyticsService.getYearly(year),
    });
};