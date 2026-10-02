import React from "react";
import {Pressable, StyleSheet, View} from "react-native";

import SectionCard from "../../../components/common/SectionCard";
import {Button} from "../../../components/Button";
import {Spacer} from "../../../components";

import {StatsRow} from "../../../components/common/ui/StatsRow";
import {RemainingInvestment} from "../../../components/common/ui/RemainingInvestment";

import {Body, Caption, Heading, Title,} from "../../../components/typography";

import {colors, radius, spacing} from "../../../design";
import {formatCurrency} from "../../../utils/currency";
import {monthNames} from "../../../utils/months";
import {useToastStore} from "../../../stores/useToastStore";

/**
 * Investment health, mapped onto the app palette.
 * "orange" has no palette equivalent, so it stays a
 * literal to keep the four states distinguishable.
 */
const statusColors = {
    green: colors.success,
    yellow: colors.warning,
    orange: "#FB923C",
    red: colors.danger,
} as const;

export const SetInvestmentGoalScreen = ({
                                            month,
                                            selectedMonth,
                                            months,
                                            onSetGoal,
                                            onMonthPress,
                                        }: any) => {

    const investment = month?.investment ?? {};
    const remaining = investment?.remaining ?? 0;

    const goalAmount = month?.investment?.goalAmount ?? 0;
    const invested = month?.investment?.invested ?? 0;
    const hasGoal = goalAmount > 0;
    const hasInvestments = invested > 0;

    if (!hasGoal && !hasInvestments) {
        return (
            <SectionCard>
                <View style={styles.empty}>
                    <Heading align="center">
                        Start Your Investment Journey
                    </Heading>

                    <Body
                        color="textSecondary"
                        align="center"
                        style={styles.emptySubtitle}
                    >
                        Set a monthly goal and track your
                        progress throughout the year.
                    </Body>

                    <Button
                        title="Set Investment Goal"
                        onPress={onSetGoal}
                        fullWidth
                    />
                </View>
            </SectionCard>
        );
    }

    if (!hasGoal && hasInvestments) {
        return (
            <>
                <SectionCard>
                    <View style={styles.empty}>
                        <Heading align="center">
                            Investments Found
                        </Heading>

                        <Body
                            color="textSecondary"
                            align="center"
                            style={styles.emptySubtitle}
                        >
                            You've already invested this month
                            but no goal was configured.
                        </Body>

                        <Button
                            title="Set Goal"
                            onPress={onSetGoal}
                            fullWidth
                        />
                    </View>
                </SectionCard>

                <Spacer size="md"/>

                <Streak months={months} month={selectedMonth}/>

                <Spacer size="md"/>

                <ActivityGrid
                    months={months}
                    onMonthPress={onMonthPress}
                />
            </>
        );
    }

    return (
        <>
            <SectionCard
                title="Monthly Goal"
                actionLabel="Edit"
                onActionPress={onSetGoal}
            >
                <View style={styles.summary}>
                    <Title
                        weight="bold"
                        style={styles.summaryAmount}
                    >
                        {formatCurrency(goalAmount)}
                    </Title>
                </View>

                {month && (
                    <>
                        <View style={styles.divider}/>

                        <Heading>
                            {monthNames[(month.month ?? 1) - 1]} Summary
                        </Heading>

                        <StatsRow
                            items={[
                                {
                                    label: "Invested",
                                    value: invested,
                                    color: colors.success,
                                },
                                {
                                    label: "Goal",
                                    value: goalAmount,
                                    color: colors.primary,
                                },
                            ]}
                        />

                        <RemainingInvestment remaining={remaining}/>
                    </>
                )}
            </SectionCard>

            <Spacer size="md"/>

            <Streak months={months} month={selectedMonth}/>

            <Spacer size="md"/>

            <ActivityGrid
                months={months}
                onMonthPress={onMonthPress}
            />
        </>
    );
};

const Streak = ({months, month}: any) => {

    /**
     * Count back from the month being viewed, not from
     * December. Walking from year-end always breaks on the
     * first future month, which pinned the streak at 0.
     */
    let streak = 0;

    for (let i = (month ?? 1) - 1; i >= 0; i--) {
        if ((months?.[i]?.investment?.invested ?? 0) > 0) streak++;
        else break;
    }

    return (
        <SectionCard>
            <View style={styles.streak}>
                <Caption color="textSecondary">
                    Consistency
                </Caption>

                <Body
                    weight="bold"
                    style={styles.streakText}
                >
                    🔥 {streak} Month Streak
                </Body>
            </View>
        </SectionCard>
    );
};

const ActivityGrid = ({months, onMonthPress}: any) => {
    const {show} = useToastStore();

    const handlePress = (month: any) => {
        const goalAmount = month?.investment?.goalAmount ?? 0;
        const invested = month?.investment?.invested ?? 0;

        if (goalAmount === 0 && invested === 0) {
            show("Set a goal to unlock this month");
            return;
        }

        onMonthPress(month);
    };

    return (
        <SectionCard title="Activity">
            <View style={styles.grid}>
                {monthNames.map((name, i) => {

                    const m = months?.[i] ?? {};
                    const goalAmount = m?.investment?.goalAmount ?? 0;
                    const invested = m?.investment?.invested ?? 0;
                    const locked = goalAmount === 0 && invested === 0;

                    const color = locked
                        ? colors.border
                        : statusColors[
                            (m?.investment
                                ?.status as keyof typeof statusColors) ?? "green"
                            ];

                    return (
                        <Pressable
                            key={i}
                            style={({pressed}) => [
                                styles.cell,
                                pressed && styles.pressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`${name} investment activity`}
                            onPress={() => handlePress(m)}
                        >
                            <View
                                style={[
                                    styles.box,
                                    {backgroundColor: color},
                                    locked && styles.disabledBox,
                                ]}
                            />

                            <Caption
                                color={
                                    locked
                                        ? "textMuted"
                                        : "textSecondary"
                                }
                            >
                                {name}
                            </Caption>
                        </Pressable>
                    );
                })}
            </View>
        </SectionCard>
    );
};

const styles = StyleSheet.create({

    empty: {
        alignItems: "center",
        paddingVertical: spacing.sm,
    },

    emptySubtitle: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
        lineHeight: 21,
    },

    summary: {
        alignItems: "center",
        paddingVertical: spacing.sm,
    },

    summaryAmount: {
        marginTop: spacing.xxs,
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },

    streak: {
        alignItems: "center",
        paddingVertical: spacing.xs,
    },

    streakText: {
        marginTop: spacing.xxs,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: spacing.sm,
    },

    cell: {
        width: "25%",
        alignItems: "center",
        marginBottom: spacing.lg,
    },

    box: {
        width: 28,
        height: 28,
        borderRadius: radius.xs,
        marginBottom: spacing.xs,
    },

    disabledBox: {
        opacity: 0.6,
    },

    pressed: {
        opacity: 0.6,
    },
});
