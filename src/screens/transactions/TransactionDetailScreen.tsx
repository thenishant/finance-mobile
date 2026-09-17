import React from "react";
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

import {Button} from "../../components/common/ui";
import {transactionService} from "../../services/transaction.service";
import {Transaction} from "../../types/transaction";
import {formatDateTime} from "../../utils/date";
import {colors} from "../../design";
import {transactionColors} from "../../design/transactionColors";

type RouteParams = {
    TransactionDetail: {
        transactionId: string;
    };
};

const DetailRow = ({
                       label,
                       value,
                   }: {
    label: string;
    value?: string | number | null;
}) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "-"}</Text>
    </View>
);

const ReviewBanner = () => (
    <View style={styles.reviewBanner}>
        <Text style={styles.reviewTitle}>
            ⚠ Review Suggested Category
        </Text>
        <Text style={styles.reviewSubtitle}>
            We weren't completely confident about the AI-selected
            category. Please review it and edit the transaction if needed.
        </Text>
    </View>
);

const TransactionDetailScreen = () => {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const route =
        useRoute<RouteProp<RouteParams, "TransactionDetail">>();
    const {transactionId} = route.params;

    const {data: transaction, isLoading} =
        useQuery<Transaction>({
            queryKey: ["transaction", transactionId],
            queryFn: () =>
                transactionService.getById(transactionId),
        });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            transactionService.delete(id),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            navigation.goBack();
        },
    });

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            `Delete ₹${Number(
                transaction?.amount ?? 0,
            ).toLocaleString("en-IN")} transaction?`,
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        deleteMutation.mutate(transactionId),
                },
            ],
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator
                    size="small"
                    color={colors.textMuted}
                />
            </SafeAreaView>
        );
    }

    if (!transaction) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.emptyText}>
                    Transaction not found
                </Text>
            </SafeAreaView>
        );
    }

    const amountColor =
        transactionColors[transaction.type].primary;

    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {transaction.needsCategoryReview && (
                    <ReviewBanner/>
                )}

                <View style={styles.hero}>
                    <Text
                        style={[
                            styles.amount,
                            {color: amountColor},
                        ]}
                    >
                        ₹
                        {Number(
                            transaction.amount,
                        ).toLocaleString("en-IN")}
                    </Text>

                    <Text style={styles.heroTitle}>
                        {transaction.merchant?.name ??
                            transaction.merchantNormalized ??
                            transaction.merchantRaw ??
                            "Transaction"}
                    </Text>

                    <Text style={styles.heroDate}>
                        {formatDateTime(transaction.date)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <DetailRow
                        label="Type"
                        value={transaction.type}
                    />

                    <DetailRow
                        label="Time"
                        value={formatDateTime(transaction.date)}
                    />

                    {transaction.merchant && (
                        <DetailRow
                            label="Merchant"
                            value={transaction.merchant.name}
                        />
                    )}

                    {transaction.category?.parent && (
                        <DetailRow
                            label="Main Category"
                            value={
                                transaction.category.parent.name
                            }
                        />
                    )}

                    {transaction.category && (
                        <DetailRow
                            label="Sub Category"
                            value={transaction.category.name}
                        />
                    )}

                    {transaction.sourceAccount?.name && (
                        <DetailRow
                            label="From Account"
                            value={
                                transaction.sourceAccount.name
                            }
                        />
                    )}

                    {transaction.destinationAccount?.name && (
                        <DetailRow
                            label="To Account"
                            value={
                                transaction.destinationAccount.name
                            }
                        />
                    )}

                    {transaction.note && (
                        <DetailRow
                            label="Note"
                            value={transaction.note}
                        />
                    )}
                </View>

                <View style={styles.actions}>
                    <View style={styles.actionButton}>
                        <Button
                            title="Edit"
                            onPress={() =>
                                navigation.navigate(
                                    "AddTransaction",
                                    {
                                        mode: "edit",
                                        transactionId:
                                        transaction.id,
                                    },
                                )
                            }
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <Button
                            title={
                                deleteMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"
                            }
                            variant="secondary"
                            onPress={handleDelete}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkBackground,
    },

    content: {
        paddingHorizontal: 32,
        paddingTop: 12,
        paddingBottom: 40,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.darkBackground,
    },

    hero: {
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 14,
        borderRadius: 28,
        backgroundColor: colors.darkGrey,
    },

    amount: {
        fontSize: 34,
        fontWeight: "800",
    },

    heroTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "700",
        color: colors.white,
        textAlign: "center",
    },

    heroDate: {
        marginTop: 5,
        fontSize: 13,
        color: colors.textSecondary,
    },

    card: {
        overflow: "hidden",
        borderRadius: 28,
        paddingHorizontal: 20,
        backgroundColor: colors.darkGrey,
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },

    label: {
        fontSize: 13,
        color: colors.textSecondary,
    },

    value: {
        maxWidth: "62%",
        fontSize: 14,
        fontWeight: "600",
        color: colors.white,
        textAlign: "right",
    },

    actions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },

    actionButton: {
        flex: 1,
    },

    reviewBanner: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        backgroundColor: "#2A220F",
        borderColor: "#5B4610",
    },

    reviewTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#F59E0B",
    },

    reviewSubtitle: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
    },

    emptyText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.textSecondary,
    },
});
