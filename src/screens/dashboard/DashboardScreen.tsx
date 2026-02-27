import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Animated, RefreshControl, ScrollView, StyleSheet, Text, View,} from "react-native";
import {Feather} from "@expo/vector-icons";

import {analyticsService} from "../../services/analytics.service";
import {MonthComparison, MonthlyAnalytics} from "../../types/api.types";
import {supabase} from "../../lib/supabase";
import {useAuth} from "../../hooks/useAuth";

const formatCurrency = (value: number) =>
    `₹ ${Math.round(value).toLocaleString("en-IN")}`;

const DashboardScreen = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] =
        useState<MonthlyAnalytics | null>(null);
    const [comparison, setComparison] =
        useState<MonthComparison | null>(null);

    const animatedBalance = useRef(new Animated.Value(0)).current;
    const [displayBalance, setDisplayBalance] = useState(0);

    const loadData = async () => {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            const monthly =
                await analyticsService.getMonthly(year, month);
            const compare =
                await analyticsService.getMonthComparison(year, month);

            setAnalytics(monthly);
            setComparison(compare);
        } catch (error) {

            console.log("Dashboard error:", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadData();
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!analytics) return;

        const total =
            analytics.totalIncome -
            analytics.totalExpense -
            analytics.totalInvestment;

        animatedBalance.setValue(0);

        Animated.timing(animatedBalance, {
            toValue: total,
            duration: 800,
            useNativeDriver: false,
        }).start();

        const listener = animatedBalance.addListener(({value}) => {
            setDisplayBalance(value);
        });

        return () => {
            animatedBalance.removeListener(listener);
        };
    }, [analytics]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!analytics) {
        return (
            <View style={styles.center}>
                <Text>No data available</Text>
            </View>
        );
    }

    const totalBalance =
        analytics.totalIncome -
        analytics.totalExpense -
        analytics.totalInvestment;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{paddingBottom: 40}}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {/* HERO */}
            <View style={styles.hero}>
                <Text style={styles.heroSmall}>Total Balance</Text>

                <Text style={styles.heroAmount}>
                    {formatCurrency(displayBalance)}
                </Text>
            </View>

            {/* SUMMARY CARD */}
            <View style={styles.summaryCard}>
                <View style={styles.statsRow}>
                    <StatBlock
                        icon="arrow-down-left"
                        label="Income"
                        value={analytics.totalIncome}
                        percent={comparison?.change.income.percent}
                        color="#10B981"
                    />

                    <View style={styles.verticalDivider}/>

                    <StatBlock
                        icon="arrow-up-right"
                        label="Expense"
                        value={analytics.totalExpense}
                        percent={comparison?.change.expense.percent}
                        color="#EF4444"
                    />

                    <View style={styles.verticalDivider}/>

                    <StatBlock
                        icon="trending-up"
                        label="Savings"
                        value={analytics.netSavings}
                        percent={comparison?.change.savings.percent}
                        color="#2563EB"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const StatBlock = ({
                       icon,
                       label,
                       value,
                       percent,
                       color,
                   }: {
    icon: any;
    label: string;
    value: number;
    percent?: number | null;
    color: string;
}) => {
    const positive = percent && percent > 0;
    const negative = percent && percent < 0;

    const percentColor = positive
        ? "#10B981"
        : negative
            ? "#EF4444"
            : "#9CA3AF";

    return (
        <View style={styles.statBlock}>
            <View style={[styles.iconContainer, {backgroundColor: `${color}15`}]}>
                <Feather name={icon} size={16} color={color}/>
            </View>

            <Text style={styles.statLabel}>{label}</Text>

            <Text style={[styles.statValue, {color}]}>
                {formatCurrency(value)}
            </Text>

            {percent !== null && percent !== undefined && (
                <Text style={[styles.percentText, {color: percentColor}]}>
                    {percent > 0 ? "▲" : percent < 0 ? "▼" : "•"}{" "}
                    {Math.abs(percent)}%
                </Text>
            )}
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    hero: {
        backgroundColor: "#111827",
        paddingTop: 100,
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

    summaryCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: -40,
        borderRadius: 24,
        paddingVertical: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 25,
        elevation: 8,
    },

    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },

    statBlock: {
        flex: 1,
        alignItems: "center",
    },

    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },

    statLabel: {
        fontSize: 12,
        color: "#6B7280",
    },

    statValue: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 6,
    },

    percentText: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: "500",
    },

    verticalDivider: {
        width: 1,
        height: 60,
        backgroundColor: "#F3F4F6",
    },
});