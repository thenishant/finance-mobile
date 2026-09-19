import React from "react";
import {ActivityIndicator, Alert, StyleSheet, View,} from "react-native";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";
import {AppScreen} from "../../ui";
import {Button} from "../../components/common/ui";
import {AppText, Stack} from "../../components/common";
import {transactionService} from "../../services/transaction.service";
import {Transaction} from "../../types/transaction";
import {colors, spacing} from "../../design";
import ReviewCategorySection from "./components/transactionDetailsScreen/ReviewCategorySection";
import TransactionSummarySection from "./components/transactionDetailsScreen/TransactionSummarySection";
import TransactionDetailsSection from "./components/transactionDetailsScreen/TransactionDetailsSection";
import {FinanceIconType} from "../../design/icons";

type RouteParams = {
    TransactionDetail: {
        transactionId: string;
    };
};

const transactionIconType: Record<
    Transaction["type"],
    FinanceIconType
> = {
    INCOME: "income",
    EXPENSE: "expense",
    INVESTMENT: "investment",
    TRANSFER: "transfer",
};

const TransactionDetailScreen = () => {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const route = useRoute<RouteProp<RouteParams, "TransactionDetail">>();
    const {transactionId} = route.params;
    const {data: transaction, isLoading,} = useQuery<Transaction>({
        queryKey: ["transaction", transactionId],
        queryFn: () =>
            transactionService.getById(transactionId),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            navigation.goBack();
        },
    });

    const handleEdit = () => {
        navigation.navigate("AddTransaction", {
            mode: "edit",
            transactionId,
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            `Delete ₹${Number(
                transaction?.amount ?? 0,
            ).toLocaleString("en-IN")} transaction?`,
            [{
                text: "Cancel",
                style: "cancel",
            }, {
                text: "Delete",
                style: "destructive",
                onPress: () =>
                    deleteMutation.mutate(transactionId),
            }],
        );
    };

    if (isLoading) {
        return (
            <AppScreen
                safeArea={false}
                padded={false}
                keyboard={false}
            >
                <View style={styles.center}>
                    <ActivityIndicator
                        size="small"
                        color={colors.textMuted}
                    />
                </View>
            </AppScreen>
        );
    }

    if (!transaction) {
        return (
            <AppScreen
                safeArea={false}
                padded={false}
                keyboard={false}
            >
                <View style={styles.center}>
                    <AppText
                        variant="body"
                        color={colors.textSecondary}
                    >
                        Transaction not found
                    </AppText>
                </View>
            </AppScreen>
        );
    }

    const merchant = transaction.merchant?.name ?? transaction.merchantNormalized ?? "Transaction";
    return (
        <AppScreen
            scroll
            safeArea={false}
            padded={false}
            keyboard={false}
            contentContainerStyle={styles.content}
        >
            <Stack spacing="md">
                {transaction.needsCategoryReview && (
                    <ReviewCategorySection/>
                )}

                <TransactionSummarySection
                    amount={transaction.amount}
                    merchant={merchant}
                    date={transaction.date}
                    type={transactionIconType[transaction.type]}
                />

                <TransactionDetailsSection transaction={transaction}/>
                <Stack
                    direction="horizontal"
                    spacing="sm"
                >
                    <View style={styles.action}>
                        <Button
                            title="Edit"
                            onPress={handleEdit}
                        />
                    </View>

                    <View style={styles.action}>
                        <Button
                            title={
                                deleteMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"
                            }
                            variant="secondary"
                            disabled={
                                deleteMutation.isPending
                            }
                            onPress={handleDelete}
                        />
                    </View>
                </Stack>
            </Stack>
        </AppScreen>
    );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    action: {
        flex: 1,
    },
});