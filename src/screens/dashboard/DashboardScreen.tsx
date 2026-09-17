import React, {useCallback} from "react";
import {RefreshControl, ScrollView, StyleSheet, View,} from "react-native";

import {useMonthStore} from "../../stores/useMonthStore";
import {useDashboard} from "../../hooks/useDashboard";

import {AppScreen} from "../../ui";
import {Body, Heading} from "../../components/typography";
import {Spacer} from "../../components";

import HeroCard from "../../components/premium/HeroCardV2";
import StatsCarousel from "../../components/dashboard/StatsCarousel";
import AccountsSection from "../../components/dashboard/AccountsSection";
import ActivitySection from "../../components/dashboard/ActivitySection";
import MonthSelector from "../../components/common/ui/MonthSelector";

import {spacing} from "../../design";

const MonthSelectorContainer = React.memo(
    function MonthSelectorContainer() {
        const year = useMonthStore((state) => state.year);
        const month = useMonthStore((state) => state.month);

        const prevMonth = useMonthStore((state) => state.prevMonth);
        const nextMonth = useMonthStore((state) => state.nextMonth);

        return (
            <View style={styles.monthSelector}>
                <MonthSelector
                    year={year}
                    month={month}
                    onPrevious={prevMonth}
                    onNext={nextMonth}
                />
            </View>
        );
    },
);

export default function DashboardScreen() {
    const year = useMonthStore((state) => state.year);
    const month = useMonthStore((state) => state.month);

    const {
        data,
        isLoading,
        error,
        refetch,
    } = useDashboard(year, month);

    if (isLoading && !data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.center}>
                    <Body>
                        Loading...
                    </Body>
                </View>
            </AppScreen>
        );
    }

    if (error && !data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.center}>
                    <Heading>
                        Something went wrong
                    </Heading>

                    <Spacer size="sm"/>

                    <Body>
                        Unable to load your dashboard.
                    </Body>
                </View>
            </AppScreen>
        );
    }

    if (!data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.center}>
                    <Body>
                        No dashboard data available.
                    </Body>
                </View>
            </AppScreen>
        );
    }

    const {
        summary,
        comparison,
        accounts,
        recentTransactions,
    } = data;

    return (
        <AppScreen keyboard={false}>
            <View style={styles.container}>
                <MonthSelectorContainer/>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <HeroCard
                        balance={summary.totalBalance}
                        change={
                            comparison.change.savings.percent ?? 0
                        }
                        changeLabel="This Month"
                    />

                    <Spacer size="md"/>

                    <StatsCarousel
                        income={summary.monthlyIncome}
                        expense={summary.monthlyExpense}
                        investment={summary.monthlyInvestment}
                        savings={summary.monthlySavings}
                        incomeChange={
                            comparison.change.income.percent ?? 0
                        }
                        expenseChange={
                            comparison.change.expense.percent ?? 0
                        }
                        investmentChange={
                            comparison.change.investment.percent ?? 0
                        }
                        savingsChange={
                            comparison.change.savings.percent ?? 0
                        }
                    />

                    <Spacer size="md"/>

                    <AccountsSection
                        accounts={accounts}
                    />

                    <Spacer size="md"/>

                    <ActivitySection
                        transactions={recentTransactions}
                    />

                    <Spacer size="lg"/>
                </ScrollView>
            </View>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 0,
    },

    monthSelector: {
        width: "100%",
        marginBottom: spacing.sm,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: spacing.lg,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});