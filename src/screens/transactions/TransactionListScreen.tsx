import React, {useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "../../services/transaction.service";
import {useGroupedTransactions} from "../../hooks/useGroupedTransactions";
import {Transaction} from "../../types/transaction";
import {TransactionList} from "./components/TransactionsList";
import {useNavigation} from "@react-navigation/native";
import {Pill} from "../../components/common/ui";
import {Ionicons} from "@expo/vector-icons";

const TransactionListScreen = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation<any>();
    const [sortBy, setSortBy] = useState<"date" | "createdAt">("date");
    const {data: transactions = [], isLoading, refetch, isRefetching,} = useQuery<Transaction[]>({
        queryKey: ["transactions", sortBy],
        queryFn: () => transactionService.getAll(sortBy),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.delete(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({
                queryKey: ["transactions", sortBy],
            });

            const previous =
                queryClient.getQueryData<Transaction[]>([
                    "transactions",
                    sortBy
                ]);

            queryClient.setQueryData<Transaction[]>(
                ["transactions", sortBy],
                (old = []) => old.filter(t => t.id !== id)
            );

            return {previous};
        },

        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    ["transactions", sortBy],
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

    const grouped = useGroupedTransactions(transactions, sortBy);

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

    const toggleSort = () => {
        setSortBy(current => current === "date" ? "createdAt" : "date");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.toolbar}>
                <View style={styles.sortPill}>
                    <Pill
                        label={
                            sortBy === "date"
                                ? "Sort: By Transaction date"
                                : "Sort: By Date Added"
                        }
                        onPress={toggleSort}
                    />

                    <Ionicons
                        name="swap-vertical-outline"
                        size={14}
                        color="#6B7280"
                        style={styles.sortIcon}
                        pointerEvents="none"
                    />
                </View>
            </View>

            <TransactionList
                data={grouped}
                isLoading={isLoading}
                refreshing={isRefetching}
                onRefresh={refetch}
                onDelete={(id) => deleteMutation.mutate(id)}
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
    toolbar: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "flex-end",
    },
    sortPill: {
        position: "relative",
    },
    sortIcon: {
        position: "absolute",
        left: 3,
        top: "50%",
        marginTop: -7,
    },
});

export default TransactionListScreen;