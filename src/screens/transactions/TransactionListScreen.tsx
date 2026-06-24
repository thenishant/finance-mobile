import React from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../../services/transaction.service";
import {useGroupedTransactions} from "../../hooks/useGroupedTransactions";
import {Transaction} from "../../types/transaction";
import {TransactionList} from "./components/TransactionsList";
import {useNavigation} from "@react-navigation/native";

const TransactionListScreen = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation<any>();

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
            await queryClient.cancelQueries({
                queryKey: ["transactions"],
            });

            const previous =
                queryClient.getQueryData<Transaction[]>([
                    "transactions",
                ]);

            queryClient.setQueryData<Transaction[]>(
                ["transactions"],
                (old = []) =>
                    old.filter((t) => t.id !== id)
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

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["transactions"]}),
                queryClient.invalidateQueries({queryKey: ["dashboard"]}),
                queryClient.invalidateQueries({queryKey: ["analytics"]}),
                queryClient.invalidateQueries({queryKey: ["accounts"]}),
            ]);
        },
    });

    const grouped = useGroupedTransactions(transactions);

    const handleTransactionPress = (
        transaction: Transaction
    ) => {
        // navigation.navigate(
        //     "AddTransaction",
        //     {mode: "edit", transactionId: transaction.id}
        // );
        navigation.navigate(
            "TransactionDetail", {
                transactionId: transaction.id,
            }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TransactionList
                data={grouped}
                isLoading={isLoading}
                refreshing={isRefetching}
                onRefresh={refetch}
                onDelete={(id) =>
                    deleteMutation.mutate(id)
                }
                onPress={handleTransactionPress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
});

export default TransactionListScreen;