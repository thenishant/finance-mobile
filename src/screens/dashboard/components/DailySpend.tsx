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
        // borderRadius: 20,
        padding: 18,
        // shadowColor: "#000",
        // shadowOpacity: 0.04,
        // shadowRadius: 12,
        // shadowOffset: {width: 0, height: 6},
        // elevation: 3,
    },
    title: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 10,
    },
    big: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F172A",
    }
});