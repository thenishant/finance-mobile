import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Transaction} from "../../../types/transaction";
import {TransactionItem} from "./TransactionItem";

interface Props {
    date: string;
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export const TransactionGroup = ({
                                     date,
                                     transactions,
                                     onDelete,
                                 }: Props) => {
    return (
        <View style={styles.section}>
            <Text style={styles.date}>{date}</Text>

            <View style={styles.group}>
                {transactions.map((t, index) => (
                    <View key={t.id}>
                        <TransactionItem
                            id={t.id}
                            type={t.type}
                            amount={t.amount}
                            category={t.category?.name}
                            account={t.fromAccount?.name}
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
        marginBottom: 18,
    },
    date: {
        fontSize: 11,
        fontWeight: "600",
        color: "#94A3B8",
        marginBottom: 8,
        paddingHorizontal: 4,
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