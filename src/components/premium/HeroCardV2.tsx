import React from "react";
import {StyleSheet, View,} from "react-native";

import {LinearGradient} from "expo-linear-gradient";
import {AmountText, Body, Caption,} from "../typography";

import {colors, radius, shadows, spacing,} from "../../design";


export interface HeroCardProps {
    greeting?: string;
    title?: string;

    balance: number;

    change?: number;
    changeLabel?: string;
    chartData?: number[];
}

export default function HeroCard({
                                     greeting = "Good Afternoon 👋",
                                     title = "Net Worth",
                                     balance,
                                     change,
                                     changeLabel = "This Month",
                                 }: HeroCardProps) {
    const positive = (change ?? 0) >= 0;

    return (

        <LinearGradient
            colors={[
                colors.heroStart,
                colors.heroEnd,
            ]}
            start={{
                x: 0,
                y: 0,
            }}
            end={{
                x: 1,
                y: 1,
            }}
            style={styles.container}
        >
            <View style={styles.glow}/>
            <Caption
                color="textLight"
                weight="medium"
            >
                {greeting}
            </Caption>

            <AmountText
                value={balance}
                style={styles.balance}
            />

            <Body color="textMutedLight">
                {title}
            </Body>

            {change !== undefined && (

                <View style={styles.changeRow}>
                    <Body
                        weight="bold"
                        color={positive ? "success" : "danger"}>
                        {positive ? "▲" : "▼"}{" "}
                        {Math.abs(change).toFixed(2)}%
                    </Body>

                    <Caption
                        color="textSecondary"
                    >
                        {changeLabel}
                    </Caption>

                </View>

            )}
        </LinearGradient>

    );

}
const styles = StyleSheet.create({
    container: {
        borderRadius: radius.xl,
        padding: spacing.xl,
        overflow: "hidden",
        ...shadows.hero,
    },

    glow: {
        position: "absolute",
        width: 240,
        height: 240,
        borderRadius: 120,
        top: -100,
        right: -70,
        backgroundColor: colors.overlayLight,
    },

    spacing: {
        height: spacing.sm,
    },

    balance: {
        fontSize: spacing.xxl,
        lineHeight: 40,
    },

    filter: {
        marginTop: spacing.lg,
    },

    changeRow: {
        marginTop: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
});