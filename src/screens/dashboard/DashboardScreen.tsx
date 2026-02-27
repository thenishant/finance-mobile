import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Animated, RefreshControl, StyleSheet, View,} from "react-native";
import {analyticsService} from "../../services/analytics.service";
import {MonthComparison, MonthlyAnalytics} from "../../types/api.types";
import {DashboardHero} from "./components/DashboardHero";
import {SummaryCard} from "./components/SummaryCard";
import {MonthSelector} from "../../components/ui/MonthSelector";
import {SafeAreaView} from "react-native-safe-area-context";
import {formatCurrencyCompact, formatCurrencyNumber} from "../../utils/formatCurrency";

const DashboardScreen = () => {
    const now = new Date();

    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
    const [comparison, setComparison] = useState<MonthComparison | null>(null);

    const animatedBalance = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const [displayBalance, setDisplayBalance] = useState(0);

    const loadData = async () => {
        try {
            const year = selectedYear;
            const month = selectedMonth;

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
    }, [selectedYear, selectedMonth]);

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
        return <View style={styles.center}/>;
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>

            {/* 🔥 Sticky Month Selector */}
            <MonthSelector
                month={selectedMonth}
                year={selectedYear}
                comparison={comparison}
                scrollY={scrollY}
                onChange={(year, month) => {
                    setSelectedYear(year);
                    setSelectedMonth(month);
                }}
            />

            <Animated.ScrollView
                contentContainerStyle={{paddingBottom: 40}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >
                <DashboardHero
                    balance={displayBalance}
                    formatCurrency={formatCurrencyNumber}
                />

                <SummaryCard
                    analytics={analytics}
                    comparison={comparison}
                    formatCurrency={formatCurrencyCompact}
                />
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});