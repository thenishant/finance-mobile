import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Animated, RefreshControl, StyleSheet, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useQuery} from "@tanstack/react-query";

import {analyticsService} from "../../services/analytics.service";
import {DashboardHero} from "./components/DashboardHero";
import {SummaryCard} from "./components/SummaryCard";
import {MonthSelector} from "../../components/ui/MonthSelector";
import {formatCurrencyCompact, formatCurrencyNumber,} from "../../utils/formatCurrency";

const DashboardScreen = () => {
    const now = new Date();

    const [selectedYear, setSelectedYear] = useState(
        now.getFullYear()
    );
    const [selectedMonth, setSelectedMonth] = useState(
        now.getMonth() + 1
    );

    const animatedBalance = useRef(
        new Animated.Value(0)
    ).current;

    const scrollY = useRef(
        new Animated.Value(0)
    ).current;

    const [displayBalance, setDisplayBalance] =
        useState(0);

    // 🔥 React Query (parallel calls)
    const {
        data,
        isLoading,
        isRefetching,
        refetch,
    } = useQuery({
        queryKey: [
            "dashboard",
            selectedYear,
            selectedMonth,
        ],
        queryFn: async () => {
            const [monthly, compare] =
                await Promise.all([
                    analyticsService.getMonthly(
                        selectedYear,
                        selectedMonth
                    ),
                    analyticsService.getMonthComparison(
                        selectedYear,
                        selectedMonth
                    ),
                ]);

            return {
                monthly,
                comparison: compare,
            };
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: (previous) => previous
    });

    const analytics = data?.monthly;
    const comparison = data?.comparison;

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

        const listener =
            animatedBalance.addListener(
                ({value}) => {
                    setDisplayBalance(value);
                }
            );

        return () => {
            animatedBalance.removeListener(
                listener
            );
        };
    }, [analytics]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!analytics) {
        return (
            <View style={styles.center}/>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top"]}
        >
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
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            isRefetching
                        }
                        onRefresh={refetch}
                    />
                }
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollY,
                                },
                            },
                        },
                    ],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >
                <DashboardHero
                    balance={displayBalance}
                    formatCurrency={
                        formatCurrencyNumber
                    }
                />

                <SummaryCard
                    analytics={analytics}
                    comparison={comparison}
                    formatCurrency={
                        formatCurrencyCompact
                    }
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