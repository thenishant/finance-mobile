import React from "react";
import {StyleSheet, View} from "react-native";
import {StatBlock} from "./StatBlock";
import {colors} from "../../../design/colors";

interface Props {
    analytics: any;
    comparison: any;
    formatCurrency: (value: number) => string;
}

export const SummaryCard = ({analytics, comparison, formatCurrency}: Props) => {
    return (
        <View style={styles.summaryCard}>
            <View style={styles.statsRow}>

                <StatBlock
                    icon="arrow-down-left"
                    label="Income"
                    value={analytics.totalIncome}
                    percent={comparison?.change.income.percent}
                    color={colors.income}
                    formatCurrency={formatCurrency}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="arrow-up-right"
                    label="Expense"
                    value={analytics.totalExpense}
                    percent={comparison?.change.expense.percent}
                    color={colors.expense}
                    formatCurrency={formatCurrency}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="pie-chart"
                    label="Investment"
                    value={analytics.totalInvestment}
                    percent={comparison?.change.investment?.percent}
                    color={colors.investment}
                    formatCurrency={formatCurrency}
                />

                <View style={styles.verticalDivider}/>

                <StatBlock
                    icon="activity"
                    label="Savings"
                    value={analytics.netSavings}
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
        backgroundColor: "#FFFFFF",
        marginHorizontal: 10,
        marginTop: -40,
        borderRadius: 24,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 25,
        elevation: 8,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    verticalDivider: {
        width: 1,
        height: 50,
        backgroundColor: "#F3F4F6",
    },
});