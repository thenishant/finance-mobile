import React from "react";
import {StyleSheet, View} from "react-native";
import {colors, spacing} from "../../../design";
import {AppText, Card, Stack} from "../../../components/common";
import SummaryStat from "../../../components/common/SummaryStat";
import {formatCurrency} from "../../../utils/currency";

type HeroCardProps = {
    totalBalance: number;
    income: number;
    expense: number;
    investment: number;
    savings: number;
};

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 👋";
    if (hour < 17) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
};

export default function HeroCard({
                                     totalBalance,
                                     income,
                                     expense,
                                     investment,
                                     savings,
                                 }: HeroCardProps) {
    return (
        <Card>
            <Stack spacing="lg">
                <AppText
                    variant="body"
                    color={colors.textSecondary}
                >
                    {getGreeting()}
                </AppText>

                <Stack spacing="xs">
                    <AppText
                        variant="caption"
                        color={colors.textSecondary}
                    >
                        Total Balance
                    </AppText>

                    <AppText
                        variant="display"
                        weight="700"
                    >
                        {formatCurrency(totalBalance)}
                    </AppText>
                </Stack>

                <View style={styles.statsRow}>
                    <SummaryStat
                        title="Income"
                        value={income}
                        icon="trending-up-outline"
                        color={colors.success}
                    />

                    <SummaryStat
                        title="Expense"
                        value={expense}
                        icon="trending-down-outline"
                        color={colors.danger}
                    />

                    <SummaryStat
                        title="Invest"
                        value={investment}
                        icon="bar-chart-outline"
                        color={colors.primary}
                    />

                    <SummaryStat
                        title="Savings"
                        value={savings}
                        icon="wallet-outline"
                        color={colors.warning}
                    />
                </View>
            </Stack>
        </Card>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: "row",
        gap: spacing.sm,
        // marginTop: spacing.md,
    }
});