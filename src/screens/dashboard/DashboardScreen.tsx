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
import {DailySpendCard} from "./components/DailySpend";
import {SpendingTrendsCard} from "./components/SpendingTrendsCard";
import {useNavigation} from "@react-navigation/native";

const DashboardScreen = () => {
    const navigation = useNavigation<any>();
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
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor="#FFFFFF"
                        progressBackgroundColor="#0F172A"
                        colors={["#FFFFFF"]}
                    />
                }
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >

                {/* HEADER */}
                <View style={styles.topSection}>

                    <MonthSelector
                        variant="dark"
                        scrollY={scrollY}
                        comparison={comparison}
                    />

                    <TotalBalanceHero
                        accounts={accounts}
                        onAccountPress={(account: { id: any; }) =>
                            navigation.navigate("AccountDetail", {
                                accountId: account.id,
                            })
                        }
                    />
                </View>

                {isEmpty ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            No transactions yet
                        </Text>
                        <Text style={styles.emptySub}>
                            Add your first expense 🚀
                        </Text>
                    </View>
                ) : (
                    <View style={styles.contentSection}>

                        <SummaryCard
                            analytics={analytics}
                            comparison={comparison}
                            formatCurrency={formatCurrencyCompact}
                        />

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
        backgroundColor: "#0F172A",
    },

    scrollView: {
        flex: 1,
        backgroundColor: "#0F172A",
    },

    content: {
        paddingBottom: 60,
        backgroundColor: "#F8FAFC",
        flexGrow: 1,
    },

    topSection: {
        backgroundColor: "#0F172A",
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    topSafeArea: {
        backgroundColor: "#0F172A",
    },

    contentSection: {
        marginTop: -24,
        backgroundColor: "#F8FAFC",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    errorText: {
        color: "#EF4444",
    },

    emptyCard: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: "center",
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    emptySub: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 8,
        textAlign: "center",
    },

    section: {
        marginTop: 0,
    },
});