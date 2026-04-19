import React from "react";
import {Modal, Pressable, StyleSheet, Text, View} from "react-native";

import {ValuePickerSheet} from "../ui/ValuePickerSheet";
import {ProgressRing} from "../ui/ProgressRing";
import {monthNames} from "../../utils/months";
import {StatsRow} from "../ui/StatsRow";
import {RemainingInvestment} from "../ui/RemainingInvestment";
import {Button} from "../ui";

import {useSetInvestmentGoal} from "../../hooks/useSetInvestmentGoal";
import {useMonthStore} from "../../stores/useMonthStore";
import {useToastStore} from "../../stores/useToastStore";

export const SetInvestmentGoalSheet = ({visible, income, onClose}: any) => {

    const {mutate, isPending} = useSetInvestmentGoal();
    const {month} = useMonthStore();
    const {show} = useToastStore();

    const year = new Date().getFullYear();

    const presets = ["10", "20", "30", "40"];

    return (
        <ValuePickerSheet
            visible={visible}
            title="Set Investment Goal"
            subtitle="Choose % of income to invest"
            presets={presets}
            placeholder="Enter percent"
            onSave={(value) => {

                const percent = Number(value);
                if (!percent) return;

                mutate(
                    {
                        year,
                        month,
                        goalPercent: percent
                    },
                    {
                        onSuccess: () => {
                            show("🎯 Goal set successfully");
                            onClose();
                        }
                    }
                );
            }}
            onClose={onClose}
            // loading={isPending} // optional if your sheet supports it
            renderPreview={(value) => {

                const percent = Number(value) || 0;
                if (!percent) return null;

                const goalAmount = income * percent / 100;

                return (
                    <>
                        <ProgressRing
                            goal={{
                                percent,
                                goalAmount,
                                invested: 0,
                                remaining: goalAmount,
                                progress: 0
                            }}
                        />

                        <Text style={styles.previewText}>
                            ₹{goalAmount.toLocaleString()} per month
                        </Text>
                    </>
                );
            }}
        />
    );
};

export const MonthDetailsSheet = ({visible, month, onClose}: any) => {

    if (!month) return null;

    const investment = month?.investment ?? {};

    const invested = investment?.invested ?? 0;
    const goalAmount = investment?.goalAmount ?? 0;
    const remaining = investment?.remaining ?? 0;

    const progress =
        goalAmount > 0
            ? Math.min(invested / goalAmount, 1)
            : 0;

    const percent = Math.round(progress * 100);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >

            <View style={styles.overlay}>

                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                <View style={styles.sheet}>

                    <View style={styles.handle}/>

                    <Text style={styles.title}>
                        {monthNames[(month.month ?? 1) - 1]} Details
                    </Text>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {width: `${percent}%`}
                            ]}
                        />
                    </View>

                    <Text style={styles.progressText}>
                        {percent}% of goal reached
                    </Text>

                    <StatsRow
                        items={[
                            {label: "Saved", value: invested, color: "#10B981"},
                            {label: "Goal", value: goalAmount, color: "#2563EB"}
                        ]}
                    />

                    <RemainingInvestment
                        remaining={remaining}
                    />

                    <Button
                        title="Close"
                        onPress={onClose}
                        style={{marginTop: 20}}
                    />

                </View>

            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({

    previewText: {
        marginTop: 6,
        fontWeight: "600",
        color: "#374151"
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end"
    },

    backdrop: {
        flex: 1
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 30
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 14
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16
    },

    progressBar: {
        height: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 6
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#10B981"
    },

    progressText: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 16
    }
})
