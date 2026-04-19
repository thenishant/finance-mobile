import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {DailySpendData} from "../../../hooks/useDailySpendingTrends";

interface SpendingTrendsCardProps {
    data: DailySpendData[];
    isLoading?: boolean;
}

export const SpendingTrendsCard = ({data, isLoading}: SpendingTrendsCardProps) => {
    if (isLoading) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Spending Trends</Text>
                <View style={styles.shimmer}/>
            </View>
        );
    }

    const maxAmount = Math.max(...data.map(d => d.amount), 1);
    const avgAmount = data.reduce((sum, d) => sum + d.amount, 0) / data.length;

    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <Text style={styles.title}>Spending Trends</Text>
                <Text style={styles.subtitle}>Last 7 days</Text>
            </View>

            <View style={styles.chartContainer}>
                {data.map((item, index) => {
                    const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    const isAboveAvg = item.amount > avgAmount;

                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${Math.max(percentage, 5)}%`,
                                            backgroundColor: isAboveAvg ? "#EF4444" : "#3B82F6"
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={styles.day}>{item.day}</Text>
                            {item.amount > 0 && (
                                <Text style={styles.amount}>₹{Math.round(item.amount)}</Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 18,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    subtitle: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 2,
    },
    chartContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 120,
        marginBottom: 12,
    },
    barWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        marginHorizontal: 4,
    },
    barContainer: {
        width: "100%",
        height: 100,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    bar: {
        width: "100%",
        minHeight: 4,
        borderRadius: 4,
    },
    day: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6B7280",
        marginTop: 8,
    },
    amount: {
        fontSize: 10,
        color: "#9CA3AF",
        marginTop: 2,
    },
    legend: {
        flexDirection: "row",
        gap: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
        color: "#6B7280",
    },
    shimmer: {
        height: 100,
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        marginTop: 12,
    },
});


