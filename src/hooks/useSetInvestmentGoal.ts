import {useMutation, useQueryClient} from "@tanstack/react-query";
import {investmentService} from "../services/investment.service";

export const useSetInvestmentGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: investmentService.setGoal,
        onSuccess: () => {
            // 🔥 refresh analytics instantly
            queryClient.invalidateQueries({queryKey: ["analytics-year"]});
            queryClient.invalidateQueries({queryKey: ["analytics"]});
        }
    });
};