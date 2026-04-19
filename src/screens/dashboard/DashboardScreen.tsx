import React, {useRef} from "react";
import {Animated, RefreshControl, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {MonthSelector} from "../../components/ui/MonthSelector";
import {SummaryCard} from "./components/SummaryCard";
import {TotalBalanceHero} from "./components/TotalBalanceHero";

import {useMonthStore} from "../../stores/useMonthStore";
import {useDashboard} from "../../hooks/useDashboard";
import {useAccounts} from "../../hooks/useAccounts";
import {useDailySpendingTrends} from "../../hooks/useDailySpendingTrends";
import {formatCurrencyCompact} from "../../utils/formatCurrency";
import {DashboardSkeleton} from "./components/DashboardSkeleton";
import {BudgetCard} from "./components/BudgetCard";
import {DailySpendCard} from "./components/DailySpend";
import {SpendingTrendsCard} from "./components/SpendingTrendsCard";

const DashboardScreen = () => {

    const year = useMonthStore(s => s.year);
    const month = useMonthStore(s => s.month);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {data, isLoading, isRefetching, refetch, error} = useDashboard(year, month);

    const {data: accounts = []} = useAccounts();
    const {data: trendData = [], isLoading: trendsLoading} = useDailySpendingTrends(7);
    const analytics = data?.monthly;
    const comparison = data?.comparison;

    if (isLoading) return <DashboardSkeleton/>;

    if (error || !analytics) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    Failed to load dashboard
                </Text>
            </View>
        );
    }

    const isEmpty = !analytics.totalIncome && !analytics.totalExpense && !analytics.totalInvestment;
    const spent = analytics.totalExpense ?? 0;

    const budget = Math.max(analytics.totalIncome * 0.6, 1);
    const days = new Date(year, month, 0).getDate();
    const today = new Date().getDate();
    const elapsedDays = year === new Date().getFullYear() && month === new Date().getMonth() + 1 ? today : days;
    const dailySpend = elapsedDays > 0 ? spent / elapsedDays : 0;

    return (
        <View style={styles.container}>

            <SafeAreaView edges={["top"]} style={styles.topSafeArea}/>

            <Animated.ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >

                {/* HEADER */}
                <View style={styles.topSection}>

                    <MonthSelector
                        variant="dark"
                        scrollY={scrollY}
                        comparison={comparison}
                    />

                    <TotalBalanceHero accounts={accounts}/>

                </View>

                {isEmpty ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>
                            No transactions yet
                        </Text>
                        <Text style={styles.emptySub}>
                            Add your first expense 🚀
                        </Text>
                    </View>
                ) : (
                    <View style={styles.summaryWrapper}>

                        <SummaryCard
                            analytics={analytics}
                            comparison={comparison}
                            formatCurrency={formatCurrencyCompact}
                        />


                        <View style={styles.section}>
                            <BudgetCard spent={spent} budget={budget}/>
                        </View>

                        <View style={styles.section}>
                            <DailySpendCard amount={dailySpend}/>
                        </View>

                        <View style={styles.section}>
                            <SpendingTrendsCard data={trendData} isLoading={trendsLoading}/>
                        </View>
                    </View>
                )}

            </Animated.ScrollView>

        </View>
    );
};

export default DashboardScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },

    content: {
        paddingBottom: 60,
    },

    topSection: {
        backgroundColor: "#0F172A",
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    topSafeArea: {
        backgroundColor: "#0F172A",
    },

    summaryWrapper: {
        marginTop: -28,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    errorText: {
        color: "#EF4444",
    },

    empty: {
        marginTop: 80,
        alignItems: "center",
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },

    emptySub: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 6,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },

    title: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 8,
    },

    amount: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    sub: {
        fontSize: 14,
        color: "#9CA3AF",
    },

    bigNumber: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
    },

    caption: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 6,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },

    merchant: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },

    expenseAmount: {
        fontSize: 16,
        fontWeight: "700",
        color: "#EF4444",
    },

    statusGreen: {
        fontSize: 12,
        color: "#10B981",
        fontWeight: "600",
    },

    progressBg: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 6,
        marginTop: 10,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#10B981",
        borderRadius: 6,
    },

    section: {
        // marginTop: 1,
    },
});