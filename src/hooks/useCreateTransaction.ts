import {useMutation, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../services/transaction.service";
import {useTransactionDraft} from "../stores/useTransactionDraft";

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const draft = useTransactionDraft();

    return useMutation({
        mutationFn: () =>
            transactionService.create({
                transactionType: draft.transactionType,
                paymentMethod: draft.paymentMethod,
                amount: Number(draft.amount),
                date: draft.date.toISOString(),
                categoryId:
                    draft.transactionType !== "TRANSFER"
                        ? draft.selectedCategory?.id
                        : undefined,
                fromAccountId: draft.selectedAccount?.id,
                note: draft.note,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });

            queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });

            draft.reset();
        },
    });
};