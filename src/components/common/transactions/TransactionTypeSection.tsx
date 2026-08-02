import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";

import {TRANSACTION_TYPES_LABELS, TransactionType} from "../../../types/transaction";
import {transactionColors} from "../../../design/transactionColors";
import {colors} from "../../../design/colors";

interface Props {
    value: TransactionType;
    onChange: (v: TransactionType) => void;
}

export const TransactionTypeSection = ({
                                           value,
                                           onChange,
                                       }: Props) => {
    return (
        <View style={styles.container}>
            {TRANSACTION_TYPES_LABELS.map(item => {
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
                                transactionColors[item.value].primary,
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
        backgroundColor: colors.darkBackground,
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
        fontSize: 20,
        marginBottom: 5,
        color: colors.white,
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.white,
    },
    activeText: {
        color: colors.white
    }
});