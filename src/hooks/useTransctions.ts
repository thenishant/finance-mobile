import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

import {TransactionFilters, transactionService, TransactionSortBy,} from "../services/transaction.service";

import {Transaction} from "../types/transaction";

type UseTransactionsParams = {
    year: number;
    month: number;
    sortBy?: TransactionSortBy;
    filters?: TransactionFilters;
};

export const useTransactions = ({
                                    year,
                                    month,
                                    sortBy = "date",
                                    filters = {},
                                }: UseTransactionsParams) => {
    const queryClient = useQueryClient();

    const queryKey = [
        "transactions",
        year,
        month,
        sortBy,
        filters,
    ];

    const query = useQuery<Transaction[]>({
        queryKey,

        queryFn: () =>
            transactionService.getAll({
                year,
                month,
                sortBy,
                order: "desc",
                ...filters,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            transactionService.delete(id),

        onMutate: async id => {
            await queryClient.cancelQueries({
                queryKey: ["transactions"],
            });

            const previous =
                queryClient.getQueryData<Transaction[]>(
                    queryKey,
                );

            queryClient.setQueryData<Transaction[]>(
                queryKey,
                (old = []) =>
                    old.filter(
                        transaction =>
                            transaction.id !== id,
                    ),
            );

            return {previous};
        },

        onError: (_error, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    queryKey,
                    context.previous,
                );
            }
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["dashboard"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["analytics"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["accounts"],
                }),
            ]);
        },
    });

    const refresh = async () => {
        await query.refetch();
    };

    return {
        transactions: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        refetch: query.refetch,
        refresh,

        deleteTransaction: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};