import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../../services/transaction.service";
import {useGroupedTransactions} from "../../hooks/useGroupedTransactions";
import {Transaction} from "../../types/transaction";
import {TransactionList} from "./components/TransactionsList";

const TransactionListScreen = () => {
    const queryClient = useQueryClient();

    const {
        data: transactions = [],
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: transactionService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({queryKey: ["transactions"]});

            const previous =
                queryClient.getQueryData<Transaction[]>(["transactions"]);

            queryClient.setQueryData<Transaction[]>(
                ["transactions"],
                (old = []) => old.filter((t) => t.id !== id)
            );

            return {previous};
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    ["transactions"],
                    context.previous
                );
            }
        },
    });

    const grouped = useGroupedTransactions(transactions);

    return (
        <SafeAreaView style={{flex: 1}}>
            <TransactionList
                data={grouped}
                isLoading={isLoading}
                refreshing={isRefetching}
                onRefresh={refetch}
                onDelete={(id) => deleteMutation.mutate(id)}
            />
        </SafeAreaView>
    );
};

export default TransactionListScreen;