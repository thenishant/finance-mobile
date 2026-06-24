import React from "react";
import {Modal, Pressable, StyleSheet, Text, View} from "react-native";

import {ValuePickerSheet} from "../../../components/ui/ValuePickerSheet";
import {monthNames} from "../../../utils/months";
import {StatsRow} from "../../../components/ui/StatsRow";
import {RemainingInvestment} from "../../../components/ui/RemainingInvestment";
import {Button} from "../../../components/ui";

import {useSetInvestmentGoal} from "../../../hooks/useSetInvestmentGoal";
import {useToastStore} from "../../../stores/useToastStore";
import {useMonthStore} from "../../../stores/useMonthStore";

type SetInvestmentGoalSheetProps = {
    visible: boolean;
    income: number;
    onClose: () => void;
};

export const SetInvestmentGoalSheet = ({
                                           visible,
                                           income,
                                           onClose,
                                       }: SetInvestmentGoalSheetProps) => {

    const {mutate, isPending} = useSetInvestmentGoal();
    const {show} = useToastStore();
    const {month} = useMonthStore();

    const year = new Date().getFullYear();

    const presets = ["10", "15", "20", "30"];

    return (
        <ValuePickerSheet
            visible={visible}
            title="Set Investment Goal"
            subtitle="How much of your income would you like to invest each month?"
            presets={presets}
            placeholder="Enter percent"
            onSave={(value) => {

                const percent = Number(value);

                if (percent <= 0) {
                    return;
                }

                mutate(
                    {
                        year,
                        month,
                        goalPercent: percent
                    },
                    {
                        onSuccess: () => {
                            show("Investment goal saved");
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
                        <View style={styles.previewCard}>
                            <Text style={styles.previewLabel}>
                                Monthly Investment Target
                            </Text>

                            <Text style={styles.previewAmount}>
                                ₹{goalAmount.toLocaleString("en-IN")}
                            </Text>
                        </View>
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
                        {monthNames[(month.month ?? 1) - 1]} Investment Summary
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
                        {invested.toLocaleString("en-IN")} of {goalAmount.toLocaleString("en-IN")} invested
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

    previewCard: {
        marginTop: 12,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#F9FAFB",
        alignItems: "center",
    },

    previewLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 6,
    },

    previewAmount: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        letterSpacing: -0.5,
    },

    previewText: {
        display: "none",
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
        padding: 24,
        paddingBottom: 24
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
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
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
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 16,
        textAlign: "center",
    }
})
