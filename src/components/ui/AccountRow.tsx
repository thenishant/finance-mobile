import React from "react";
import {StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {AmountText, Body, Caption,} from "../typography";

import {colors, radius, spacing,} from "../../design";

export interface AccountRowProps {
    name: string;
    last4?: string;
    balance: number;
    type: string;
    progress: number; // 0-1
}

export default function AccountRow({
                                       name,
                                       last4,
                                       balance,
                                       type,
                                       progress,
                                   }: AccountRowProps) {

    const icon =
        type === "CREDIT_CARD"
            ? "card-outline"
            : "business-outline";

    return (
        <View>
            <View style={styles.header}>

                <View style={styles.left}>

                    <View style={styles.icon}>
                        <Ionicons
                            name={icon}
                            size={18}
                            color={colors.primary}
                        />
                    </View>

                    <View>

                        <Body
                            weight="semibold"
                            numberOfLines={1}>
                            {name}
                        </Body>

                        <Caption color="textSecondary">
                            ••{last4}
                        </Caption>

                    </View>

                </View>

                <AmountText
                    value={balance}
                    style={styles.amount}
                    color={
                        balance >= 0
                            ? "text"
                            : "danger"
                    }
                />

            </View>

            <View style={styles.progressBackground}>

                <View
                    style={[
                        styles.progress,
                        {
                            width: `${progress * 100}%`,
                        },
                    ]}
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    icon: {
        width: spacing.xxl,
        height: spacing.xxl,
        borderRadius: radius.md,
        backgroundColor: colors.heroStart,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },

    amount: {
        fontSize: spacing.lg,
    },

    progressBackground: {
        marginTop: spacing.sm,
        height: 3,
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: colors.heroStart,
    },

    progress: {
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
});