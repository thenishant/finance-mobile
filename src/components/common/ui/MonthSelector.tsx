import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors, radius, shadows, spacing} from "../../../design";
import {Body, Caption} from "../../typography";

interface Props {
    year: number;
    month: number;
    onPrevious: () => void;
    onNext: () => void;
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function MonthSelector({
                                          year,
                                          month,
                                          onPrevious,
                                          onNext,
                                      }: Props) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const isCurrentMonth = year === currentYear && month === currentMonth;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPrevious}
                hitSlop={8}
                style={({pressed}) => [
                    styles.button,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name="chevron-back"
                    size={20}
                    color={colors.text}
                />
            </Pressable>
            <View style={styles.month}>
                <Body weight="semibold" style={styles.monthName}>{MONTHS[month - 1]} {year}</Body>
            </View>

            <Pressable
                onPress={onNext}
                disabled={isCurrentMonth}
                hitSlop={8}
                style={({pressed}) => [
                    styles.button,
                    isCurrentMonth && styles.disabledButton,
                    pressed && !isCurrentMonth && styles.pressed]}
            >
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isCurrentMonth ? colors.textMuted : colors.text}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xs,
        ...shadows.card,
        marginBottom: spacing.sm,
    },

    button: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        borderRadius: radius.sm,
    },

    disabledButton: {
        opacity: 0.45,
    },

    pressed: {
        opacity: 0.7,
    },

    month: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    monthName: {
        textAlign: "center",
    },
});