import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {colors, radius, shadows, spacing,} from "../../../design";

import {Body, Caption,} from "../../typography";

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
                <Body
                    weight="semibold"
                    style={styles.monthName}
                >
                    {MONTHS[month - 1]}
                </Body>

                <Caption color="muted">
                    {year}
                </Caption>
            </View>

            <Pressable
                onPress={onNext}
                hitSlop={8}
                style={({pressed}) => [
                    styles.button,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text}
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

        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,

        padding: spacing.xs,

        ...shadows.card,
    },

    button: {
        width: 42,
        height: 42,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: colors.background,

        borderRadius: radius.md,
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