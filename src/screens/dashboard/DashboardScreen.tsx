import React, {useRef} from "react";
import {Animated, RefreshControl, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {MonthSelector} from "../../components/ui/MonthSelector";
import {SummaryCard} from "./components/SummaryCard";
import {TotalBalanceHero} from "./components/TotalBalanceHero";

import {useMonthStore} from "../../stores/useMonthStore";
import {useDashboard} from "../../hooks/useDashboard";
import {useAccounts} from "../../hooks/useAccounts";
import {formatCurrencyCompact} from "../../utils/formatCurrency";
import {DashboardSkeleton} from "./components/DashboardSkeleton";

const DashboardScreen = () => {

    const year = useMonthStore(s => s.year);
    const month = useMonthStore(s => s.month);

    const scrollY = useRef(new Animated.Value(0)).current;

    const {data, isLoading, isRefetching, refetch, error} =
        useDashboard(year, month);

    const {data: accounts = []} = useAccounts();

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

    const isEmpty =
        !analytics.totalIncome &&
        !analytics.totalExpense &&
        !analytics.totalInvestment;

    return (
        <SafeAreaView style={styles.container}>

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

                {/* 🔥 DARK SECTION (INSIDE SCROLL) */}
                <View style={styles.topSection}>

                    <MonthSelector
                        comparison={comparison}
                        scrollY={scrollY}
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
                    </View>
                )}

            </Animated.ScrollView>

        </SafeAreaView>
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
        paddingBottom: 40, // 🔥 space for overlap
    },

    summaryWrapper: {
        marginTop: -28, // 🔥 now this works perfectly
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

});