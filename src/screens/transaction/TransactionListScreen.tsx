import React, {useEffect, useMemo, useState} from "react";
import {ActivityIndicator, FlatList, RefreshControl, StatusBar, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {transactionService} from "../../services/transaction.service";
import {TransactionSection} from "./components/TransactionSection";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    date: string;
    category?: { name: string };
    fromAccount?: { name: string };
}

type ListItem =
    | { type: "header"; date: string }
    | { type: "item"; transaction: Transaction };

const TransactionListScreen = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const res = await transactionService.getAll();
        setTransactions(res);
    };

    useEffect(() => {
        const init = async () => {
            await loadData();
            setLoading(false);
        };
        init();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDelete = async (id: string) => {
        await transactionService.delete(id);
        loadData();
    };

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        if (isSameDay(date, today)) return "Today";
        if (isSameDay(date, yesterday)) return "Yesterday";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const groupedData = useMemo(() => {
        const grouped: Record<string, Transaction[]> = {};

        transactions.forEach((trx) => {
            const label = formatDateLabel(trx.date);
            if (!grouped[label]) grouped[label] = [];
            grouped[label].push(trx);
        });

        return Object.entries(grouped).map(([date, trxList]) => ({
            date,
            transactions: trxList,
        }));
    }, [transactions]);

    const dailyExpenseMap = useMemo(() => {
        const map: Record<string, number> = {};

        transactions.forEach((trx) => {
            const label = formatDateLabel(trx.date);

            if (!map[label]) map[label] = 0;

            if (trx.type === "EXPENSE") {
                map[label] += trx.amount;
            }
        });

        return map;
    }, [transactions]);

    const insight = useMemo(() => {
        const todayExpense = dailyExpenseMap["Today"];
        const yesterdayExpense = dailyExpenseMap["Yesterday"];

        if (!todayExpense || !yesterdayExpense) return null;
        if (yesterdayExpense === 0) return null;

        const percentChange =
            ((todayExpense - yesterdayExpense) / yesterdayExpense) * 100;

        const rounded = Math.abs(percentChange).toFixed(0);

        if (percentChange > 5) {
            return `Spent ${rounded}% more than yesterday`;
        }

        if (percentChange < -5) {
            return `Spent ${rounded}% less than yesterday`;
        }

        return null;
    }, [dailyExpenseMap]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!transactions.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar barStyle="dark-content"/>
            {insight && (
                <View style={styles.insightCard}>
                    <Text style={styles.insightText}>
                        {insight}
                    </Text>
                </View>
            )}

            <FlatList
                data={groupedData}
                keyExtractor={(item) => item.date}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                contentContainerStyle={styles.content}
                renderItem={({item}) => (
                    <TransactionSection
                        date={item.date}
                        transactions={item.transactions.map(t => ({
                            id: t.id,
                            type: t.type,
                            amount: t.amount,
                            category: t.category?.name,
                            account: t.fromAccount?.name,
                        }))}
                        onDelete={handleDelete}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default TransactionListScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    insightCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 10,
        padding: 10,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: "#2563EB",
    },

    insightText: {
        fontSize: 12,
        color: "#374151",
        fontWeight: "500",
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#6B7280",
    },
    dateHeader: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginTop: 18,
        marginBottom: 8,
    },
    row: {
        marginBottom: 6,
    },
});