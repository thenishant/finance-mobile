import {useQuery} from "@tanstack/react-query";
import {transactionService} from "../services/transaction.service";

export const useTransactions = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: transactionService.getAll,
    });
};