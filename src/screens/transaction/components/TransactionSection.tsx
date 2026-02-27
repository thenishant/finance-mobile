import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {TransactionItem} from "./TransactionItem";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    category?: string;
    account?: string;
}

interface Props {
    date: string;
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export const TransactionSection = ({
                                       date,
                                       transactions,
                                       onDelete,
                                   }: Props) => {
    const netTotal = transactions.reduce((sum, t) => {
        if (t.type === "INCOME") return sum + t.amount;
        if (t.type === "EXPENSE") return sum - t.amount;
        return sum;
    }, 0);

    const totalColor =
        netTotal > 0 ? "#16A34A" :
            netTotal < 0 ? "#DC2626" :
                "#6B7280";

    const sign = netTotal > 0 ? "+" : "";

    return (
        <View style={styles.section}>
            {/* 🔹 Date + Total Row */}
            {date ? (
                <View style={styles.headerRow}>
                    <Text style={styles.date}>{date}</Text>

                    {/*<Text style={[styles.total, {color: totalColor}]}>*/}
                    {/*    {sign}₹ {Math.abs(netTotal).toLocaleString("en-IN")}*/}
                    {/*</Text>*/}
                </View>
            ) : null}

            <View style={styles.group}>
                {transactions.map((t, index) => (
                    <View key={t.id}>
                        <TransactionItem
                            id={t.id}
                            type={t.type}
                            amount={t.amount}
                            category={t.category}
                            account={t.account}
                            onDelete={onDelete}
                        />

                        {index !== transactions.length - 1 && (
                            <View style={styles.divider}/>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
        paddingHorizontal: 14,
    },
    date: {
        fontSize: 11,
        fontWeight: "500",
        color: "#94A3B8",
    },
    total: {
        fontSize: 12,
        fontWeight: "500",
    },
    group: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
    },

    divider: {
        height: 1,
        backgroundColor: "#EEF2F7",
        marginLeft: 48,
    },
});