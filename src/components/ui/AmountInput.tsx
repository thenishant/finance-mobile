import React, {useMemo} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";

type Props = {
    value: string; // raw numeric string (no commas)
    onChangeText: (value: string) => void;
    currency?: string;
};

const formatIndianNumber = (value: string) => {
    if (!value) return "";

    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";

    const lastThree = num.substring(num.length - 3);
    const otherNumbers = num.substring(0, num.length - 3);

    if (otherNumbers !== "") {
        return (
            otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
            "," +
            lastThree
        );
    }

    return lastThree;
};

export const AmountInput: React.FC<Props> = ({
                                                 value,
                                                 onChangeText,
                                                 currency = "₹",
                                             }) => {

    const formattedValue = useMemo(() => {
        return formatIndianNumber(value);
    }, [value]);

    const handleChange = (text: string) => {
        const clean = text.replace(/[^0-9]/g, "");
        onChangeText(clean);
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.inner}>
                <Text style={styles.currency}>{currency}</Text>

                <TextInput
                    value={formattedValue}
                    onChangeText={handleChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#D1D5DB"
                    style={styles.input}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    inner: {
        flexDirection: "row",
        alignItems: "center",
    },
    currency: {
        fontSize: 42,
        color: "#9CA3AF",
        marginRight: 6,
        fontWeight: "400",
    },
    input: {
        fontSize: 48,
        fontWeight: "700",
        textAlign: "center",
        minWidth: 10,
        color: "#111827",
    },
});