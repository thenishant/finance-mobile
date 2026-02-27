import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
    balance: number;
    formatCurrency: (value: number) => string;
}

export const DashboardHero = ({balance, formatCurrency}: Props) => {
    return (
        <View style={styles.hero}>
            <Text style={styles.heroSmall}>Total Balance</Text>
            <Text style={styles.heroAmount}>
                {formatCurrency(balance)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    hero: {
        backgroundColor: "#111827",
        paddingTop: 30,
        paddingBottom: 80,
        paddingHorizontal: 24,
    },
    heroSmall: {
        color: "#9CA3AF",
        fontSize: 14,
    },
    heroAmount: {
        color: "#FFFFFF",
        fontSize: 44,
        fontWeight: "700",
        marginTop: 10,
    },
});