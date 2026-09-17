import React from "react";
import {StyleSheet, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Body, Caption} from "../typography";

import {colors, radius, shadows, spacing,} from "../../design";

import {formatCompactCurrency} from "../../utils/currency";
import {financeIcons, FinanceIconType} from "../../design/icons";
import {fontSize} from "../../design/font";
import {fontWeights} from "../theme/fontWeight";

type Card = {
    title: string;
    value: number;
    change: number;
    type: FinanceIconType;
};

interface Props {
    income: number;
    expense: number;
    investment: number;
    savings: number;

    incomeChange: number;
    expenseChange: number;
    investmentChange: number;
    savingsChange: number;
}

export default function StatsCarousel({
                                          income,
                                          expense,
                                          investment,
                                          savings,
                                          incomeChange,
                                          expenseChange,
                                          investmentChange,
                                          savingsChange,
                                      }: Props) {

    const cards: Card[] = [
        {
            title: "Income",
            value: income,
            change: incomeChange,
            type: "income",
        },
        {
            title: "Expenses",
            value: expense,
            change: expenseChange,
            type: "expense",
        },
        {
            title: "Investments",
            value: investment,
            change: investmentChange,
            type: "investment",
        },
        {
            title: "Savings",
            value: savings,
            change: savingsChange,
            type: "savings",
        },
    ];

    return (
        <View style={styles.container}>
            {cards.map(card => {

                const positive = card.change >= 0;
                const icon = financeIcons[card.type];
                return (
                    <View
                        key={card.title}
                        style={styles.card}
                    >

                        <View
                            style={[
                                styles.iconContainer,
                                {backgroundColor: icon.background},
                            ]}
                        >
                            <Ionicons
                                name={icon.icon}
                                size={20}
                                color={icon.color}
                            />
                        </View>

                        <Caption
                            color="textSecondary"
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {card.title}
                        </Caption>

                        <Body
                            weight="bold"
                            color={icon.color}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                            style={styles.amount}>
                            {formatCompactCurrency(card.value)}
                        </Body>

                        <View style={[styles.badge, {backgroundColor: icon.background}]}>
                            <Ionicons
                                name={
                                    positive ? "caret-up" : "caret-down"
                                }
                                size={12}
                                color={icon.color}/>
                            <Body
                                color={icon.color}
                                numberOfLines={1}
                                style={styles.percent}>
                                {Math.abs(card.change).toFixed(1)}%
                            </Body>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 4
    },

    card: {
        width: "24%",
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 5,
        alignItems: "center",
        ...shadows.card,
    },

    iconContainer: {
        width: spacing.xxl,
        height: spacing.xxl,
        borderRadius: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },

    title: {
        fontSize: fontSize.sm,
        lineHeight: spacing.md,
        textAlign: "center",
        marginBottom: spacing.sm,
    },

    amount: {
        fontSize: fontSize.lg,
        lineHeight: spacing.lg,
        fontWeight: fontWeights.regular,
        textAlign: "center",
        marginBottom: spacing.sm,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: spacing.md,
        paddingHorizontal: spacing.md,
        width: "90%",
    },

    percent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontSize: fontSize.sm,
        marginLeft: spacing.xs,
        fontWeight: fontWeights.regular,
    },
});