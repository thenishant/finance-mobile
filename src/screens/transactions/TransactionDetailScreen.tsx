import React from "react";
import {ActivityIndicator, Alert, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";
import {Button} from "../../components/common/ui";
import {transactionService} from "../../services/transaction.service";
import {Transaction} from "../../types/transaction";

type RouteParams = {
    TransactionDetail: {
        transactionId: string;
    };
};

const getTransactionColor = (
    type?: string
) => {
    switch (type) {
        case "INCOME":
            return "#16A34A";
        case "EXPENSE":
            return "#DC2626";
        case "INVESTMENT":
            return "#4F46E5";
        case "TRANSFER":
            return "#2563EB";
        default:
            return "#6B7280";
    }
};

const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};

const DetailRow = ({label, value}: {
    label: string;
    value?: string | number | null;
}) => (
    <View style={styles.row}>
        <Text style={styles.label}>
            {label}
        </Text>

        <Text style={styles.value}>
            {value || "-"}
        </Text>
    </View>
);

const ReviewBanner = () => (
    <View style={styles.reviewBanner}>
        <Text style={styles.reviewTitle}>
            ⚠ Review Suggested Category
        </Text>

        <Text style={styles.reviewSubtitle}>
            We weren't completely confident about the AI-selected category.
            Please review it and edit the transaction if needed.
        </Text>
    </View>
);

const TransactionDetailScreen = () => {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const route = useRoute<RouteProp<RouteParams, "TransactionDetail">>();
    const {transactionId} = route.params;

    const {data: transaction, isLoading,} = useQuery<Transaction>({
        queryKey: ["transaction", transactionId,],
        queryFn: () => transactionService.getById(transactionId),
    });

    const deleteMutation =
        useMutation({
            mutationFn: (id: string) =>
                transactionService.delete(id),

            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: [
                        "transactions",
                    ],
                });

                navigation.goBack();
            },
        });

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            `Delete ₹${Number(transaction?.amount ?? 0).toLocaleString("en-IN")} transaction?`,
            [{
                text: "Cancel",
                style: "cancel",
            }, {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteMutation.mutate(transactionId),
            }]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </SafeAreaView>
        );
    }

    if (!transaction) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Transaction not found</Text>
            </SafeAreaView>
        );
    }

    const color =
        getTransactionColor(transaction.type);

    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={styles.container}>
            <View style={styles.content}>
                {transaction.needsCategoryReview && (
                    <ReviewBanner/>
                )}
                <View style={styles.hero}>
                    <Text style={[styles.amount, {color},]}>
                        ₹{Number(transaction.amount).toLocaleString("en-IN")}
                    </Text>

                    <Text style={styles.category}>
                        {transaction.merchant?.name ??
                            transaction.category?.name ??
                            transaction.type}
                    </Text>

                    <Text style={styles.date}>
                        {formatDate(transaction.date)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <DetailRow
                        label="Type"
                        value={transaction.type}
                    />

                    {transaction.merchant && (
                        <DetailRow
                            label="Merchant"
                            value={transaction.merchant.name}
                        />
                    )}

                    {transaction.category && (
                        <DetailRow
                            label="Category"
                            value={transaction.category.name}
                        />
                    )}

                    {transaction.sourceAccount?.name && (
                        <DetailRow
                            label="From Account"
                            value={transaction.sourceAccount.name}
                        />
                    )}

                    {transaction.destinationAccount?.name && (
                        <DetailRow
                            label="To Account"
                            value={transaction.destinationAccount.name}
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
                                    "AddTransaction", {
                                        mode: "edit",
                                        transactionId: transaction.id,
                                    }
                                )
                            }
                        />
                    </View>

                    <View style={styles.actionButton}>
                        <Button
                            title={deleteMutation.isPending ? "Deleting..." : "Delete"}
                            variant="secondary"
                            onPress={handleDelete}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            "#F5F7FA",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent:
            "center",
        alignItems: "center",
    },
    hero: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 16,
    },
    amount: {
        fontSize: 32,
        fontWeight: "800",
    },
    category: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    date: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
    },
    card: {
        backgroundColor:
            "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:
            "#F3F4F6",
    },
    label: {
        fontSize: 14,
        color: "#6B7280",
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        maxWidth: "60%",
        textAlign: "right",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 32,
    },
    actionButton: {
        flex: 1,
    },
    reviewBanner: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        backgroundColor: "#FEF3C7",
        borderColor: "#FCD34D",
    },
    reviewTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#92400E",
    },

    reviewSubtitle: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 18,
        color: "#92400E",
    },
});