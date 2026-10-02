import React from "react";
import {Modal, Pressable, StyleSheet, View} from "react-native";

import {ValuePickerSheet} from "../../../components/common/ui/ValuePickerSheet";
import {monthNames} from "../../../utils/months";
import {StatsRow} from "../../../components/common/ui/StatsRow";
import {RemainingInvestment} from "../../../components/common/ui/RemainingInvestment";
import {Button} from "../../../components/Button";

import {Body, Caption, Heading, Title,} from "../../../components/typography";
import {colors, radius, spacing} from "../../../design";
import {formatCurrency} from "../../../utils/currency";

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

    /**
     * Both from the store. Taking month from the store but
     * year from the clock wrote goals into the wrong year
     * whenever the selected month crossed a year boundary.
     */
    const {year, month} = useMonthStore();

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
                        },
                        onError: () => {
                            show("Could not save goal. Please try again.");
                        },
                    }
                );
            }}
            onClose={onClose}
            loading={isPending}
            renderPreview={(value) => {

                const percent = Number(value) || 0;
                if (!percent) return null;

                const goalAmount = income * percent / 100;

                return (
                    <View style={styles.previewCard}>
                        <Caption color="textSecondary">
                            Monthly Investment Target
                        </Caption>

                        <Title
                            weight="bold"
                            style={styles.previewAmount}
                        >
                            {formatCurrency(goalAmount)}
                        </Title>
                    </View>
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

    /**
     * A month reachable from the activity grid may have
     * investments but no goal. Progress, "remaining" and
     * "achieved" are all meaningless then, so everything
     * goal-relative is hidden rather than shown as zero.
     */
    const hasGoal = goalAmount > 0;

    const progress = hasGoal
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

                    <Heading style={styles.title}>
                        {monthNames[(month.month ?? 1) - 1]} Investment Summary
                    </Heading>

                    {hasGoal && (
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {width: `${percent}%`}
                                ]}
                            />
                        </View>
                    )}

                    <Body
                        color="textSecondary"
                        align="center"
                        style={styles.progressText}
                    >
                        {hasGoal
                            ? `${formatCurrency(invested)} of ${formatCurrency(goalAmount)} invested`
                            : `${formatCurrency(invested)} invested — no goal was set`}
                    </Body>

                    <StatsRow
                        items={[
                            {
                                label: "Saved",
                                value: invested,
                                color: colors.success,
                            },
                            ...(hasGoal
                                ? [{
                                    label: "Goal",
                                    value: goalAmount,
                                    color: colors.primary,
                                }]
                                : []),
                        ]}
                    />

                    {hasGoal && (
                        <RemainingInvestment
                            remaining={remaining}
                        />
                    )}

                    <Button
                        title="Close"
                        variant="secondary"
                        onPress={onClose}
                        fullWidth
                        style={styles.closeButton}
                    />

                </View>

            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({

    previewCard: {
        marginTop: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.overlayMedium,
        alignItems: "center",
    },

    previewAmount: {
        marginTop: spacing.xxs,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end"
    },

    backdrop: {
        flex: 1
    },

    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        padding: spacing.xl,
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: colors.border,
        borderRadius: radius.xs,
        alignSelf: "center",
        marginBottom: spacing.lg
    },

    title: {
        marginBottom: spacing.lg,
    },

    progressBar: {
        height: 10,
        backgroundColor: colors.overlayMedium,
        borderRadius: radius.xs,
        overflow: "hidden",
        marginBottom: spacing.sm
    },

    progressFill: {
        height: "100%",
        backgroundColor: colors.success
    },

    progressText: {
        marginBottom: spacing.lg,
    },

    closeButton: {
        marginTop: spacing.xl,
    },
})
