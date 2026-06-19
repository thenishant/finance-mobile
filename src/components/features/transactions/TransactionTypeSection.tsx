import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {TransactionType} from "../../../types/transaction";
import {transactionColors} from "../../../design/transactionColors";

interface Props {
    value: TransactionType;
    onChange: (v: TransactionType) => void;
}

const ITEMS = [
    {
        value: "EXPENSE",
        label: "Expense",
        emoji: "↗",
    },
    {
        value: "INCOME",
        label: "Income",
        emoji: "↙",
    },
    {
        value: "TRANSFER",
        label: "Transfer",
        emoji: "⇄",
    },
    {
        value: "INVESTMENT",
        label: "Invest",
        emoji: "◎",
    },
] as const;

export const TransactionTypeSection = ({
                                           value,
                                           onChange,
                                       }: Props) => {
    return (
        <View style={styles.container}>
            {ITEMS.map(item => {
                const active =
                    item.value === value;

                return (
                    <Pressable
                        key={item.value}
                        onPress={() =>
                            onChange(item.value)
                        }
                        style={[
                            styles.item,
                            active && {
                                backgroundColor:
                                transactionColors[
                                    item.value
                                    ].primary,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.icon,
                                active &&
                                styles.activeText,
                            ]}
                        >
                            {item.emoji}
                        </Text>
                        <Text
                            style={[
                                styles.text,
                                active &&
                                styles.activeText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#F8FAFC",
        padding: 8,
    },
    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 12,
    },
    icon: {
        fontSize: 14,
        marginBottom: 2,
        color: "#6B7280",
    },
    text: {
        fontSize: 11,
        fontWeight: "700",
        color: "#6B7280",
    },
    activeText: {
        color: "#FFFFFF",
    },
});