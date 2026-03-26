import {useQuery} from "@tanstack/react-query";
import {analyticsService} from "../services/analytics.service";
import {useMonthStore} from "../stores/useMonthStore";

export const useAnalytics = () => {

    const year = useMonthStore((s) => s.year);
    const month = useMonthStore((s) => s.month);

    return useQuery({
        queryKey: ["analytics", year, month],
        queryFn: () => analyticsService.getMonthly(year, month),
        placeholderData: (prev) => prev
    });
};