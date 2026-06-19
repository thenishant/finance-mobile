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

    const last10Days = data.slice(-7);

    const maxAmount = Math.max(...last10Days.map(d => d.amount), 1);
    const avgAmount =
        last10Days.reduce((sum, d) => sum + d.amount, 0) /
        Math.max(last10Days.length, 1);

    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Spending Trends</Text>
                    <Text style={styles.subtitle}>Last 7 days</Text>
                </View>

                <View style={styles.avgBadge}>
                    <Text style={styles.avgLabel}>Avg</Text>
                    <Text style={styles.avgValue}>₹{Math.round(avgAmount)}</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                {last10Days.map((item, index) => {
                    const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    const isAboveAvg = item.amount > avgAmount;

                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View style={styles.barContainer}>
                                <View style={styles.barTrack}/>

                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${Math.max(percentage, 5)}%`,
                                            backgroundColor: isAboveAvg ? "#EF4444" : "#2563EB"
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
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderColor: "#F3F4F6",
    },
    header: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    },
    avgBadge: {
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    avgLabel: {
        fontSize: 11,
        color: "#6B7280",
    },
    avgValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    chartContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 140,
    },
    barWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        marginHorizontal: 4,
    },
    barContainer: {
        width: "100%",
        height: 120,
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative",
    },
    barTrack: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
    },
    bar: {
        width: "100%",
        minHeight: 6,
        borderRadius: 10,
    },
    day: {
        fontSize: 11,
        fontWeight: "700",
        color: "#6B7280",
        marginTop: 10,
    },
    amount: {
        fontSize: 10,
        color: "#9CA3AF",
        marginTop: 4,
    },
    shimmer: {
        height: 100,
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        marginTop: 12,
    },
});
