import {useMutation, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../services/transaction.service";
import {TransactionType} from "../types/transaction";
import {PaymentMethod} from "../types/payment";

type CreateTransactionInput = {
    type: TransactionType;
    amount: number;
    date: string;
    categoryId?: string;
    paymentMethod: PaymentMethod;
    note?: string;
    fromAccountId?: string;
    toAccountId?: string;
};

export const useCreateTransaction = () => {

    const queryClient = useQueryClient();

    return useMutation<any, Error, CreateTransactionInput>({

        mutationFn: (data) => {

            if (!data.type) {
                throw new Error("Transaction type is required");
            }

            if (!data.amount || data.amount <= 0) {
                throw new Error("Invalid amount");
            }

            if (
                (data.type === "EXPENSE" || data.type === "INVESTMENT") &&
                !data.fromAccountId
            ) {
                throw new Error("fromAccountId required");
            }

            if (data.type === "INCOME" && !data.toAccountId) {
                throw new Error("toAccountId required");
            }

            if (data.type === "TRANSFER") {
                if (!data.fromAccountId || !data.toAccountId) {
                    throw new Error("Both accounts required");
                }

                if (data.fromAccountId === data.toAccountId) {
                    throw new Error("Cannot transfer to same account");
                }
            }

            if (data.type !== "TRANSFER" && !data.categoryId) {
                throw new Error("categoryId required");
            }
            return transactionService.create(data);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
        },
    });
};