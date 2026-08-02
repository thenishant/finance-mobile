import React from "react";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";

import {StatBlock} from "./StatBlock";
import {colors} from "../../../design";
import {DashboardComparison, DashboardSummary} from "../../../types/dashboard";

type Props = {
    summary: DashboardSummary;
    comparison: DashboardComparison | null;
    formatCurrency: (value: number) => string;
};

export const SummaryCard = ({
                                summary,
                                comparison,
                                formatCurrency,
                            }: Props) => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.summaryCard}>
            <View style={styles.statsRow}>
                <StatBlock
                    icon="arrow-down-left"
                    label="Income"
                    value={summary.monthlyIncome}
                    percent={comparison?.change.income.percent}
                    color={colors.income}
                    formatCurrency={formatCurrency}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="arrow-up-right"
                    label="Expense"
                    value={summary.monthlyExpense}
                    percent={comparison?.change.expense.percent}
                    color={colors.expense}
                    formatCurrency={formatCurrency}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="pie-chart"
                    label="Investment"
                    value={summary.monthlyInvestment}
                    percent={comparison?.change.investment.percent}
                    color={colors.investment}
                    formatCurrency={formatCurrency}
                    onPress={() => navigation.navigate("Investment")}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="activity"
                    label="Savings"
                    value={summary.monthlySavings}
                    percent={comparison?.change.savings.percent}
                    color={colors.savings}
                    formatCurrency={formatCurrency}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 16,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    verticalDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#F1F5F9",
    },
});