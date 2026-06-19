import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const DailySpendCard = ({amount}: any) => {

    return (
        <View style={styles.card}>

            <Text style={styles.title}>Avg Daily Spend</Text>

            <Text style={styles.big}>
                ₹{Math.round(amount).toLocaleString()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 18,
    },
    title: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 10,
    },
    big: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0F172A",
    }
});