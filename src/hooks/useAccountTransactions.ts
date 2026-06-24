import {useAuth} from "./useAuth";
import {useQuery} from "@tanstack/react-query";

import {financialAccountService} from "../services/account.service";
import {Transaction} from "../types/transaction";

export const useAccountTransactions = (accountId: string) => {
    const {token} = useAuth();
    return useQuery<Transaction[]>({
        queryKey: ["financial-account-transactions", accountId],
        queryFn: () => financialAccountService.getTransactions(accountId, 5),
        enabled: !!token && !!accountId
    });
};