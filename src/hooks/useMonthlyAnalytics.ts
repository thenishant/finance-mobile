import {useQuery} from "@tanstack/react-query";
import {analyticsService} from "../services/analytics.service";
import {useMonthStore} from "../stores/useMonthStore";

export const useMonthlyAnalytics = () => {

    const year = useMonthStore(s => s.year);
    const month = useMonthStore(s => s.month);

    return useQuery({
        queryKey: ["monthly-analytics", year, month],
        queryFn: () => analyticsService.getMonthly(year, month),
        staleTime: 1000 * 60 * 5,
    });
};