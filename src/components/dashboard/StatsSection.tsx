import React from "react";
import {StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import SectionCard from "../common/SectionCard";

import {Body, Caption} from "../typography";

import {spacing} from "../../design";
import {financeIcons, FinanceIconType} from "../../design/icons";
import {formatCompactCurrency} from "../../utils/currency";
import {fontSize} from "../../design/font";
import {fontWeights} from "../theme/fontWeight";

export interface Stat {
    title: string;
    value: number;
    change: number;
    type: FinanceIconType;
}

interface Props {
    stats: Stat[];
}

export default function StatsSection({stats}: Props) {
    return (
        <SectionCard>
            <View style={styles.container}>
                {stats.map((stat) => {
                    const positive = stat.change >= 0;
                    const icon = financeIcons[stat.type];

                    return (
                        <View key={stat.type} style={styles.stat}>
                            <View style={styles.icon}>
                                <Ionicons
                                    name={icon.icon}
                                    size={spacing.xl}
                                    color={icon.color}
                                />
                            </View>

                            <Caption
                                color="textSecondary"
                                numberOfLines={1}
                                style={styles.title}
                            >
                                {stat.title}
                            </Caption>

                            <Body
                                weight="bold"
                                color={icon.color}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                                style={styles.amount}
                            >
                                {formatCompactCurrency(stat.value)}
                            </Body>

                            <View style={styles.change}>
                                <Ionicons
                                    name={positive ? "caret-up" : "caret-down"}
                                    size={12}
                                    color={icon.color}
                                />

                                <Body
                                    color={icon.color}
                                    numberOfLines={1}
                                    style={styles.percent}
                                >
                                    {Math.abs(stat.change).toFixed(1)}%
                                </Body>
                            </View>
                        </View>
                    );
                })}
            </View>
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: -spacing.lg,
    },

    stat: {
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.sm,
    },

    icon: {
        margin: spacing.sm,
    },

    title: {
        fontSize: fontSize.sm,
        lineHeight: spacing.md,
        marginBottom: spacing.sm,
    },

    amount: {
        fontSize: fontSize.md,
        lineHeight: spacing.lg,
        fontWeight: fontWeights.regular,
        textAlign: "center",
        marginBottom: spacing.xxs,
    },

    change: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    percent: {
        fontSize: fontSize.sm,
        marginLeft: spacing.xs,
        fontWeight: fontWeights.regular,
    },
});