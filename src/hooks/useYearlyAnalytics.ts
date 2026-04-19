import {YearAnalytics} from "../types/analytics";
import {analyticsService} from "../services/analytics.service";
import {useQuery} from "@tanstack/react-query";

export const useYearAnalytics = (year: number) => {
    return useQuery<YearAnalytics>({
        queryKey: ["analytics-year", year],
        queryFn: () => analyticsService.getYearly(year),
    });
};