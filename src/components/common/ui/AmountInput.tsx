import React, {useMemo} from "react";
import {StyleSheet, Text, TextInput, View,} from "react-native";
import {colors} from "../../../design/colors";

type Props = {
    value: string;
    onChangeText: (value: string) => void;
    currency?: string;
};

const formatIndianNumber = (value: string) => {
    if (!value) return "";
    const [whole, decimal] = value.split(".");
    const formattedWhole = Number(whole || 0).toLocaleString("en-IN");
    if (value.endsWith(".")) {
        return `${formattedWhole}.`;
    }
    return decimal !== undefined
        ? `${formattedWhole}.${decimal}`
        : formattedWhole;
};

export const AmountInput = ({
                                value,
                                onChangeText,
                                currency = "₹",
                            }: Props) => {
    const formattedValue = useMemo(
        () => formatIndianNumber(value),
        [value]
    );

    const handleChange = (text: string) => {
        // Remove everything except digits and decimal point
        let cleaned = text.replace(/[^\d.]/g, "");

        // Allow only one decimal point
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
        }

        // Limit to 2 decimal places
        if (cleaned.includes(".")) {
            const [whole, decimal] = cleaned.split(".");
            cleaned = `${whole}.${decimal.slice(0, 2)}`;
        }

        onChangeText(cleaned);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Amount
            </Text>

            <View style={styles.amountRow}>
                <Text style={styles.currency}>{currency}</Text>

                <TextInput
                    value={formattedValue}
                    onChangeText={handleChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.white}
                    style={styles.input}
                    selectionColor={colors.white}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 10,
        backgroundColor: colors.darkBackground,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        color: colors.grey,
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    currency: {
        fontSize: 34,
        fontWeight: "500",
        color: colors.grey,
        marginRight: 6,
        marginBottom: 4,
    },
    input: {
        fontSize: 42,
        fontWeight: "500",
        color: colors.white,
        textAlign: "center",
        minWidth: 40,
    },
});