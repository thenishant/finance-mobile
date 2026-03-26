import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {StatsRow} from "../ui/StatsRow";
import {RemainingInvestment} from "../ui/RemainingInvestment";
import {Button} from "../ui";

import {monthNames} from "../../utils/months";
import {ProgressRing} from "../ui/ProgressRing";
import {useToastStore} from "../../stores/useToastStore";

const statusColors: any = {
    green: "#10B981",
    yellow: "#F59E0B",
    orange: "#FB923C",
    red: "#EF4444"
};

export const InvestmentFeature = ({
                                      goal,
                                      month,
                                      months,
                                      onSetGoal,
                                      onMonthPress
                                  }: any) => {

    const investment = month?.investment ?? {};

    const invested = investment?.invested ?? 0;
    const goalAmount = investment?.goalAmount ?? 0;
    const remaining = investment?.remaining ?? 0;

    if (!goal) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>
                    No investment goal set
                </Text>

                <Button
                    title="Set Investment Goal"
                    onPress={onSetGoal}
                />
            </View>
        );
    }

    return (
        <>
            <View style={styles.summary}>

                <ProgressRing goal={goal}/>

                {month && (
                    <>
                        <Text style={styles.monthTitle}>
                            {monthNames[(month.month ?? 1) - 1]} Summary
                        </Text>

                        <StatsRow
                            items={[
                                {label: "Saved", value: invested, color: "#10B981"},
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

        if (goalAmount === 0) {
            show("🔒 Set a goal to unlock this month");
            return;
        }

        onMonthPress(month);
    };

    return (
        <View style={styles.grid}>

            {monthNames.map((name, i) => {

                const m = months?.[i] ?? {};
                const goalAmount = m?.investment?.goalAmount ?? 0;
                const status = m?.investment?.status;

                const locked = goalAmount === 0;

                const color = locked
                    ? "#E5E7EB"
                    : statusColors[status] ?? "#E5E7EB";

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

                            {locked && (
                                <Text style={styles.lock}>
                                    🔒
                                </Text>
                            )}

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
        marginTop: 16
    },

    monthTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 16
    },

    streak: {
        marginTop: 20,
        alignItems: "center"
    },

    streakText: {
        fontSize: 16,
        fontWeight: "600"
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        paddingHorizontal: 20
    },

    cell: {
        width: "25%",
        alignItems: "center",
        marginBottom: 16
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

    lock: {
        position: "absolute",
        bottom: -2,
        right: -4,
        fontSize: 12
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
        padding: 20,
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        alignItems: "center"
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12
    }

});