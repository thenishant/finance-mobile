import {useQuery} from "@tanstack/react-query";

import {analyticsService} from "../services/analytics.service";
import {useAuth} from "./useAuth";

export const useDashboard = (
    year: number,
    month: number,
) => {
    const {isAuthenticated} = useAuth();

    return useQuery({
        queryKey: ["dashboard", year, month],
        queryFn: () => analyticsService.getDashboard(year, month),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    });
};