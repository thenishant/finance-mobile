import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const BudgetCard = ({spent, budget}: any) => {

    const percent = Math.min((spent / budget) * 100, 100);
    const isOver = percent >= 100;

    return (
        <View style={styles.card}>

            <View style={styles.rowBetween}>
                <Text style={styles.title}>Budget</Text>
                <Text style={[styles.status, isOver && styles.over]}>
                    {isOver ? "Over Budget" : "On Track"}
                </Text>
            </View>

            <Text style={styles.amount}>
                ₹{Math.round(spent).toLocaleString()}
                <Text style={styles.sub}>
                    {" "} / ₹{Math.round(budget).toLocaleString()}
                </Text>
            </Text>

            <View style={styles.progressBg}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${percent}%`,
                            backgroundColor: isOver ? "#DC2626" : "#2563EB"
                        }
                    ]}
                />
            </View>

            <Text style={styles.caption}>
                {Math.round(percent)}% used
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
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    amount: {
        fontSize: 26,
        fontWeight: "700",
        color: "#0F172A",
        marginTop: 6,
    },
    sub: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    caption: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 6,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    status: {
        fontSize: 12,
        color: "#16A34A",
        fontWeight: "600",
    },
    over: {
        color: "#DC2626",
    },
    progressBg: {
        height: 8,
        backgroundColor: "#F1F5F9",
        borderRadius: 10,
        marginTop: 14,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 20,
    },
});