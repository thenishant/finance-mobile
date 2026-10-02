import React, {useState} from "react";
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View,} from "react-native";

import {useAnalytics} from "../../hooks/useAnalytics";
import {useYearAnalytics} from "../../hooks/useYearlyAnalytics";

import {AppScreen} from "../../ui";
import {Spacer} from "../../components";
import {Button} from "../../components/Button";
import {Body, Heading} from "../../components/typography";
import MonthSelector from "../../components/common/ui/MonthSelector";

import {SetInvestmentGoalScreen} from "./components/SetInvestmentGoalScreen";
import {MonthDetailsSheet, SetInvestmentGoalSheet,} from "./components/SetInvestmentGoalSheet";

import {useMonthStore} from "../../stores/useMonthStore";
import {colors, spacing} from "../../design";

export const InvestmentScreen = () => {

    const [goalOpen, setGoalOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const {year, month, prevMonth, nextMonth} =
        useMonthStore();

    const {data} = useAnalytics();

    /**
     * Follows the selected year. Pinning this to the
     * current year showed this year's data while the
     * header read a different one.
     */
    const yearAnalytics = useYearAnalytics(year);

    const yearData = yearAnalytics.data;

    const months = yearData?.months ?? [];

    const activeMonth =
        months.find((m: any) => m.month === month) ?? null;

    /**
     * Pull-to-refresh only, so a background refetch does
     * not pop the spinner open and jolt the scroll view.
     */
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await yearAnalytics.refetch();
        } finally {
            setRefreshing(false);
        }
    };

    /**
     * Without this the screen renders "Start Your
     * Investment Journey" while the year is still loading,
     * then snaps to real content.
     */
    const body = yearAnalytics.isLoading ? (
        <View style={styles.center}>
            <ActivityIndicator color={colors.primary}/>

            <Spacer size="sm"/>

            <Body color="textSecondary">
                Loading your investments...
            </Body>
        </View>
    ) : yearAnalytics.isError ? (
        <View style={styles.center}>
            <Heading align="center">
                Something went wrong
            </Heading>

            <Spacer size="sm"/>

            <Body color="textSecondary" align="center">
                Unable to load your investments.
            </Body>

            <Spacer size="lg"/>

            <Button
                title="Retry"
                variant="secondary"
                onPress={() => yearAnalytics.refetch()}
            />
        </View>
    ) : (
        <SetInvestmentGoalScreen
            month={activeMonth}
            selectedMonth={month}
            months={months}
            onSetGoal={() => setGoalOpen(true)}
            onMonthPress={(m: any) => {
                setSelectedMonth(m);
                setMonthOpen(true);
            }}
        />
    );

    /**
     * safeArea={false}: the native stack header already
     * consumes the top inset, so letting AppScreen add
     * it again double-counts it and leaves a dead gap.
     */
    return (
        <AppScreen keyboard={false} safeArea={false}>
            <View style={styles.container}>
                <View style={styles.monthSelector}>
                    <MonthSelector
                        year={year}
                        month={month}
                        onPrevious={prevMonth}
                        onNext={nextMonth}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    {body}

                    <Spacer size="md"/>
                </ScrollView>
            </View>

            <MonthDetailsSheet
                visible={monthOpen}
                month={selectedMonth}
                onClose={() => setMonthOpen(false)}
            />

            <SetInvestmentGoalSheet
                visible={goalOpen}
                income={data?.totalIncome ?? 0}
                onClose={() => setGoalOpen(false)}
            />
        </AppScreen>
    );
};

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
        flexGrow: 1,
        paddingBottom: spacing.lg,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
    },
});
