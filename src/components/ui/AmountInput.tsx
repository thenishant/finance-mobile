import React, {useMemo} from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Props = {
    value: string;
    onChangeText: (value: string) => void;
    currency?: string;
};

const formatIndianNumber = (value: string) => {
    if (!value) return "";

    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";

    const lastThree = num.slice(-3);
    const otherNumbers = num.slice(0, -3);

    return otherNumbers
        ? `${otherNumbers.replace(
            /\B(?=(\d{2})+(?!\d))/g,
            ","
        )},${lastThree}`
        : lastThree;
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
        onChangeText(
            text.replace(/[^0-9]/g, "")
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Amount
            </Text>

            <View style={styles.amountRow}>
                <Text style={styles.currency}>
                    {currency}
                </Text>

                <TextInput
                    value={formattedValue}
                    onChangeText={handleChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#D1D5DB"
                    style={styles.input}
                    selectionColor="#111827"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 30
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: "#9CA3AF",
    },

    amountRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
    },

    currency: {
        fontSize: 34,
        fontWeight: "500",
        color: "#D1D5DB",
        marginRight: 6,
        marginBottom: 8,
    },

    input: {
        fontSize: 42,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
        minWidth: 60,
        padding: 0,
        letterSpacing: -1,
    },
});