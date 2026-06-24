import React from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    RouteProp,
    useRoute,
} from "@react-navigation/native";

import {useAccount} from "../../hooks/useAccount";
import {useAccountTransactions} from "../../hooks/useAccountTransactions";
import {ACCOUNT_TYPE_OPTIONS} from "../../types/financialAccount";

type RouteParams = {
    AccountDetail: {
        accountId: string;
    };
};

const DetailRow = ({
                       label,
                       value,
                       isLast = false,
                   }: {
    label: string;
    value: string;
    isLast?: boolean;
}) => (
    <View
        style={[
            styles.row,
            isLast && styles.lastRow,
        ]}
    >
        <Text style={styles.label}>
            {label}
        </Text>

        <Text style={styles.value}>
            {value}
        </Text>
    </View>
);

const formatCurrency = (
    amount?: string | null
) => {
    return `₹${Number(
        amount ?? 0
    ).toLocaleString("en-IN")}`;
};

export const AccountDetailScreen = () => {

    const route =
        useRoute<
            RouteProp<
                RouteParams,
                "AccountDetail"
            >
        >();

    const {accountId} =
        route.params;

    const {
        data: account,
        isLoading,
    } = useAccount(accountId);

    const {
        data: transactions = [],
    } =
        useAccountTransactions(
            accountId
        );

    const accountTypeLabel =
        ACCOUNT_TYPE_OPTIONS.find(
            option => option.value === account?.type
        )?.label ?? account?.type;

    const balanceMeta = account?.creditLimit
        ? `Credit Limit ${formatCurrency(account.creditLimit)}`
        : "Available Balance";

    if (isLoading || !account) {
        return (
            <SafeAreaView
                style={
                    styles.loadingContainer
                }
            >
                <ActivityIndicator
                    size="large"
                />
            </SafeAreaView>
        );
    }

    const rows = [
        {
            label: "Type",
            value: accountTypeLabel,
        },
        account.institutionName
            ? {
                label:
                    "Institution",
                value:
                account.institutionName,
            }
            : null,
        account.last4
            ? {
                label: "Last 4",
                value:
                account.last4,
            }
            : null,
        account.creditLimit
            ? {
                label:
                    "Credit Limit",
                value:
                    formatCurrency(
                        account.creditLimit
                    ),
            }
            : null,
    ].filter(Boolean);

    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={styles.container}
        >
            <View
                style={styles.content}
            >
                <View style={styles.hero}>
                    <Text style={styles.accountName}>
                        {account.nickname ?? account.name}
                    </Text>

                    <Text style={styles.accountType}>
                        {accountTypeLabel}
                    </Text>

                    <Text style={styles.balance}>
                        {formatCurrency(account.balance)}
                    </Text>

                    <Text style={styles.balanceMeta}>
                        {balanceMeta}
                    </Text>
                </View>

                <View
                    style={styles.card}
                >
                    {rows.map(
                        (
                            row: any,
                            index
                        ) => (
                            <DetailRow
                                key={
                                    row.label
                                }
                                label={
                                    row.label
                                }
                                value={
                                    row.value
                                }
                                isLast={
                                    index ===
                                    rows.length -
                                    1
                                }
                            />
                        )
                    )}
                </View>

                <Text
                    style={styles.sectionTitle}
                >
                    Latest Activity
                </Text>

                <View
                    style={styles.card}
                >
                    {transactions.length ===
                    0 ? (
                        <Text
                            style={
                                styles.empty
                            }
                        >
                            No
                            transactions
                            found
                        </Text>
                    ) : (
                        <FlatList
                            scrollEnabled={false}
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({item, index}) => (
                                <View
                                    style={[
                                        styles.transactionRow,
                                        index === transactions.length - 1 && styles.transactionListLastRow,
                                    ]}
                                >
                                    <View>
                                        <Text style={styles.transactionName}>
                                            {item.note ?? item.category?.name ?? item.type}
                                        </Text>
                                        <Text style={styles.transactionMeta}>
                                            {item.category?.name ?? item.type.replaceAll("_", " ")}
                                        </Text>
                                    </View>
                                    <Text style={styles.transactionAmount}>
                                        ₹{Number(item.amount).toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            "#F5F7FA",
    },

    loadingContainer: {
        flex: 1,
        justifyContent:
            "center",
        alignItems: "center",
    },

    content: {
        flex: 1,
        padding: 16,
    },

    hero: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
    },

    accountName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    accountType: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
        textTransform: "capitalize",
    },

    balance: {
        marginTop: 16,
        fontSize: 34,
        fontWeight: "800",
        color: "#111827",
    },

    balanceMeta: {
        marginTop: 8,
        fontSize: 13,
        color: "#6B7280",
    },

    card: {
        backgroundColor:
            "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor:
            "#F3F4F6",
    },

    lastRow: {
        borderBottomWidth: 0,
    },

    label: {
        color: "#6B7280",
        fontSize: 14,
    },

    value: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "600",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },

    transactionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    transactionListLastRow: {
        borderBottomWidth: 0,
    },

    transactionName: {
        fontSize: 14,
        color: "#111827",
        flex: 1,
    },

    transactionMeta: {
        marginTop: 2,
        fontSize: 12,
        color: "#6B7280",
    },

    transactionAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },

    empty: {
        textAlign: "center",
        paddingVertical: 16,
        color: "#6B7280",
    },
});