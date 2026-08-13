import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Transaction} from "../../../types/transaction";
import {TransactionItem} from "./TransactionItem";
import {colors} from "../../../design";

interface Props {
    date: string;
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onPress: (transaction: Transaction) => void;
}

export const TransactionGroup = ({
                                     date,
                                     transactions,
                                     onDelete,
                                     onPress,
                                 }: Props) => {
    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <Text style={styles.date}>
                    {date}
                </Text>

                <Text style={styles.count}>
                    {transactions.length}{" "}
                    {transactions.length === 1
                        ? "transaction"
                        : "transactions"}
                </Text>
            </View>

            <View style={styles.group}>
                {transactions.map((t, index) => (
                    <View key={t.id}>
                        <TransactionItem
                            id={t.id}
                            type={t.type}
                            amount={Number(t.amount)}
                            title={t.merchant?.name}
                            category={t.category}
                            account={t.sourceAccount?.name ?? t.destinationAccount?.name}
                            needsCategoryReview={t.needsCategoryReview}
                            onDelete={onDelete}
                            onPress={() => onPress(t)}
                        />

                        {index !==
                            transactions.length - 1 && (
                                <View
                                    style={styles.divider}
                                />
                            )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingHorizontal: 4,
    },

    date: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.grey,
        letterSpacing: 0.5,
    },

    count: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.grey,
    },

    group: {
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.white,
    },

    divider: {
        height: 1,
        backgroundColor: "#EEF2F7",
        marginLeft: 56,
    },
});