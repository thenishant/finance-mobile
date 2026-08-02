import {keepPreviousData, useQuery} from "@tanstack/react-query";

import {analyticsService} from "../services/analytics.service";


export const useDashboard = (year: number, month: number) =>
    useQuery({
        queryKey: ["dashboard", year, month],
        queryFn: () => analyticsService.getDashboard(year, month),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });