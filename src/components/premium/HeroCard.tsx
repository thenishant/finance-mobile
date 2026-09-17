import React from "react";
import {StyleSheet, View,} from "react-native";


import {AmountText, Body, Caption,} from "../typography";

import {spacing,} from "../../design";
import {Card} from "../ui";
import {HStack, VStack} from "../layout";

export interface HeroCardProps {

    title: string;

    value: number;

    subtitle?: string;

    change?: number;

    changeLabel?: string;

    footer?: React.ReactNode;

    right?: React.ReactNode;
}

export default function HeroCard({

                                     title,

                                     value,

                                     subtitle,

                                     change,

                                     changeLabel,

                                     footer,

                                     right,

                                 }: HeroCardProps) {

    const positive =
        (change ?? 0) >= 0;

    return (

        <Card style={styles.card}>

            <HStack
                justify="space-between"
                align="flex-start"
            >

                <VStack
                    spacing="sm"
                    style={{flex: 1}}
                >

                    <Caption
                        color="textSecondary"
                        weight="medium"
                    >
                        {title}
                    </Caption>

                    <AmountText
                        value={value}
                        style={styles.amount}
                    />

                    {!!subtitle && (

                        <Body
                            color="textSecondary"
                        >
                            {subtitle}
                        </Body>

                    )}

                    {change !== undefined && (

                        <HStack
                            spacing="xs"
                            align="center"
                        >

                            <Body
                                weight="semibold"
                                color={
                                    positive
                                        ? "success"
                                        : "danger"
                                }
                            >

                                {positive ? "▲" : "▼"}

                                {" "}

                                {Math.abs(change).toFixed(2)}%

                            </Body>

                            {!!changeLabel && (

                                <Caption
                                    color="textMuted"
                                >
                                    {changeLabel}
                                </Caption>

                            )}

                        </HStack>

                    )}

                </VStack>

                {right}

            </HStack>

            {footer && (

                <View
                    style={styles.footer}
                >
                    {footer}
                </View>

            )}

        </Card>

    );

}

const styles = StyleSheet.create({

    card: {

        overflow: "hidden",

    },

    amount: {

        fontSize: 42,
        lineHeight: 48,
    },
    footer: {
        marginTop: spacing.xl,
    },
});