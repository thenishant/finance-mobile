import React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";

import {AppScreen} from "../../ui";
import {Spacer} from "../../components";
import {Button} from "../../components/Button";
import {Body, Heading} from "../../components/typography";
import MonthSelector from "../../components/common/ui/MonthSelector";

import {CategoryBreakdown} from "./components/CategoryBreakdown";

import {useAnalytics} from "../../hooks/useAnalytics";
import {useMonthStore} from "../../stores/useMonthStore";
import {colors, spacing} from "../../design";

const AnalyticsScreen = () => {
    const {year, month, prevMonth, nextMonth} =
        useMonthStore();

    /**
     * useAnalytics already reads the selected month from
     * the store. The old useMonthlyAnalytics module was
     * commented out entirely, so importing it crashed.
     */
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useAnalytics();

    const body = isLoading && !data ? (
        <View style={styles.center}>
            <ActivityIndicator color={colors.primary}/>

            <Spacer size="sm"/>

            <Body color="textSecondary">
                Loading analytics...
            </Body>
        </View>
    ) : isError && !data ? (
        <View style={styles.center}>
            <Heading align="center">
                Something went wrong
            </Heading>

            <Spacer size="sm"/>

            <Body color="textSecondary" align="center">
                Unable to load your analytics.
            </Body>

            <Spacer size="lg"/>

            <Button
                title="Retry"
                variant="secondary"
                onPress={() => refetch()}
            />
        </View>
    ) : !data?.expenseBreakdown?.length ? (
        <View style={styles.center}>
            <Heading align="center">
                No spending yet
            </Heading>

            <Spacer size="sm"/>

            <Body color="textSecondary" align="center">
                Add an expense to see your category
                breakdown for this month.
            </Body>
        </View>
    ) : (
        <CategoryBreakdown data={data}/>
    );

    return (
        <AppScreen keyboard={false}>
            <View style={styles.container}>
                <View style={styles.monthSelector}>
                    <MonthSelector
                        year={year}
                        month={month}
                        onPrevious={prevMonth}
                        onNext={nextMonth}
                    />
                </View>

                {body}
            </View>
        </AppScreen>
    );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 0,
    },

    monthSelector: {
        width: "100%",
        marginBottom: spacing.sm,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },
});
