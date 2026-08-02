import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {StatsRow} from "../../../components/common/ui/StatsRow";
import {RemainingInvestment} from "../../../components/common/ui/RemainingInvestment";
import {Button} from "../../../components/common/ui";

import {monthNames} from "../../../utils/months";
import {useToastStore} from "../../../stores/useToastStore";

const statusColors = {
    green: "#10B981",
    yellow: "#F59E0B",
    orange: "#FB923C",
    red: "#EF4444",
} as const;

export const SetInvestmentGoalScreen = ({month, months, onSetGoal, onMonthPress}: any) => {

    const investment = month?.investment ?? {};
    const remaining = investment?.remaining ?? 0;

    const goalAmount = month?.investment?.goalAmount ?? 0;
    const invested = month?.investment?.invested ?? 0;
    const hasGoal = goalAmount > 0;
    const hasInvestments = invested > 0;

    if (!hasGoal && !hasInvestments) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                    Start Your Investment Journey
                </Text>

                <Text style={styles.emptySubtitle}>
                    Set a monthly goal and track your progress throughout the year.
                </Text>

                <Button
                    title="Set Investment Goal"
                    onPress={onSetGoal}
                />
            </View>
        );
    }

    if (!hasGoal && hasInvestments) {
        return (
            <>
                <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>
                        Investments Found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        You've already invested this month but no goal was configured.
                    </Text>

                    <Button
                        title="Set Goal"
                        onPress={onSetGoal}
                    />
                </View>

                <Streak months={months}/>

                <ActivityGrid
                    months={months}
                    onMonthPress={onMonthPress}
                />
            </>
        );
    }

    return (
        <>
            <View style={styles.summaryCard}>

                <Text style={styles.summaryLabel}>
                    Monthly Goal
                </Text>

                <Text style={styles.summaryAmount}>
                    ₹{goalAmount.toLocaleString("en-IN")}
                </Text>
                {month && (
                    <>
                        <Text style={styles.monthTitle}>
                            {monthNames[(month.month ?? 1) - 1]} Investment Summary
                        </Text>

                        <StatsRow
                            items={[
                                {label: "Invested", value: invested, color: "#10B981"},
                                {label: "Goal", value: goalAmount, color: "#2563EB"},
                            ]}
                        />
                        <RemainingInvestment remaining={remaining}/>
                    </>
                )}
            </View>

            <Streak months={months}/>

            <ActivityGrid
                months={months}
                onMonthPress={onMonthPress}
            />
        </>
    );
};

const Streak = ({months}: any) => {

    let streak = 0;

    for (let i = months.length - 1; i >= 0; i--) {
        if (months[i]?.investment?.invested > 0) streak++;
        else break;
    }

    return (
        <View style={styles.streak}>
            <Text style={styles.streakLabel}>
                Consistency
            </Text>

            <Text style={styles.streakText}>
                🔥 {streak} Month Streak
            </Text>
        </View>
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
        <View style={styles.grid}>

            {monthNames.map((name, i) => {

                const m = months?.[i] ?? {};
                const goalAmount = m?.investment?.goalAmount ?? 0;
                const invested = m?.investment?.invested ?? 0;
                const locked = goalAmount === 0 && invested === 0;

                const color = locked ?
                    "#E5E7EB" : statusColors[(m?.investment?.status as keyof typeof statusColors) ?? "green"];
                return (
                    <TouchableOpacity
                        key={i}
                        style={styles.cell}
                        activeOpacity={0.7}
                        onPress={() => handlePress(m)}
                    >

                        <View style={styles.boxWrapper}>

                            <View
                                style={[
                                    styles.box,
                                    {backgroundColor: color},
                                    locked && styles.disabledBox
                                ]}
                            />
                        </View>

                        <Text
                            style={[
                                styles.month,
                                locked && styles.disabledMonth
                            ]}
                        >
                            {name}
                        </Text>

                    </TouchableOpacity>
                );
            })}

        </View>
    );
};

const styles = StyleSheet.create({

    summary: {
        paddingHorizontal: 20,
        marginTop: 12,
    },
    summaryCard: {
        marginHorizontal: 20,
        marginTop: 12,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        alignItems: "center",
    },

    summaryLabel: {
        fontSize: 12,
        color: "#6B7280",
    },

    summaryAmount: {
        fontSize: 30,
        fontWeight: "800",
        color: "#111827",
        marginTop: 4,
    },

    summaryProgress: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
        marginBottom: 12,
    },
    cell: {
        width: "25%",
        alignItems: "center",
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 12,
        color: "#111827",
    },

    streak: {
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: "#F9FAFB",
        alignItems: "center",
    },

    streakLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 4,
    },

    streakText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        paddingHorizontal: 20
    },
    boxWrapper: {
        position: "relative"
    },

    box: {
        width: 28,
        height: 28,
        borderRadius: 6,
        marginBottom: 6
    },
    month: {
        fontSize: 11,
        color: "#6B7280"
    },

    disabledMonth: {
        color: "#9CA3AF"
    },

    disabledBox: {
        opacity: 0.6
    },

    empty: {
        margin: 20,
        padding: 24,
        backgroundColor: "#F9FAFB",
        borderRadius: 20,
        alignItems: "center",
    },

    emptySubtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 20,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        color: "#111827",
    }

});