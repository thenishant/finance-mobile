import {useMutation, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../services/transaction.service";
import {Transaction, TransactionType} from "../types/transaction";

type CreateTransactionInput = {
    type: TransactionType;
    amount: number;
    date: string;

    categoryId?: string;

    sourceAccountId?: string;
    destinationAccountId?: string;

    note?: string;
};

const validateTransaction = (
    data: CreateTransactionInput
) => {
    if (!data.type) {
        throw new Error("Transaction type is required");
    }

    if (!data.amount || data.amount <= 0) {
        throw new Error("Invalid amount");
    }

    if (
        (data.type === "EXPENSE" ||
            data.type === "INVESTMENT") &&
        !data.sourceAccountId
    ) {
        throw new Error("sourceAccountId required");
    }

    if (
        data.type === "INCOME" &&
        !data.destinationAccountId
    ) {
        throw new Error("destinationAccountId required");
    }

    if (data.type === "TRANSFER") {
        if (
            !data.sourceAccountId ||
            !data.destinationAccountId
        ) {
            throw new Error("Both accounts required");
        }

        if (
            data.sourceAccountId ===
            data.destinationAccountId
        ) {
            throw new Error(
                "Cannot transfer to same account"
            );
        }
    }

    if (
        data.type !== "TRANSFER" &&
        !data.categoryId
    ) {
        throw new Error("categoryId required");
    }
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Transaction,
        Error,
        CreateTransactionInput
    >({
        mutationFn: async (data) => {
            validateTransaction(data);

            return transactionService.create(data);
        },

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["financial-accounts"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["monthly-analytics"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["yearly-analytics"],
                }),
            ]);
        },
    });
};