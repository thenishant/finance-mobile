import {useAuth} from "./useAuth";
import {useQuery} from "@tanstack/react-query";
import {FinancialAccount} from "../types/api.types";
import {financialAccountService} from "../services/account.service";

export const useAccount = (accountId: string) => {
    const {token} = useAuth();
    return useQuery<FinancialAccount>({
        queryKey: ["financial-account", accountId],
        queryFn: () => financialAccountService.getById(accountId),
        enabled: !!token && !!accountId
    });
};