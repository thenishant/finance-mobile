import {useAuth} from "./useAuth";
import {useQuery} from "@tanstack/react-query";
import {FinancialAccount} from "../types/api.types";
import {financialAccountService} from "../services/account.service";

export const useAccounts = () => {
    const {token} = useAuth();

    return useQuery<FinancialAccount[]>({
        queryKey: ["financial-accounts"],
        queryFn: () => financialAccountService.getAll(),
        enabled: !!token,
    });
};