import {useMutation, useQueryClient} from "@tanstack/react-query";
import {accountService} from "../services/account.service";

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["accounts"]});
        },
    });
};