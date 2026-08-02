import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import {DashboardAccount} from "../types/dashboard";
import {IconName} from "./common/Icon";
import {colors, radius, spacing} from "../design";
import {AppText, Card, Icon} from "./common";
import {formatCompactCurrency} from "../utils/currency";


type Props = {
    account: DashboardAccount;
    onPress?: (account: DashboardAccount) => void;
};

const accountMap: Record<
    string,
    {
        icon: IconName;
        color: string;
    }
> = {
    BANK: {
        icon: "business-outline",
        color: colors.primary,
    },
    CASH: {
        icon: "wallet-outline",
        color: colors.success,
    },
    CREDIT_CARD: {
        icon: "card-outline",
        color: colors.warning,
    },
    INVESTMENT: {
        icon: "trending-up-outline",
        color: colors.investment,
    },
};

const fallback = {
    icon: "wallet-outline" as IconName,
    color: colors.primary,
};

export default function CompactAccountCard({
                                               account,
                                               onPress,
                                           }: Props) {
    const config =
        accountMap[account.type] ?? fallback;

    return (
        <Pressable
            onPress={() => onPress?.(account)}
            style={({pressed}) => [
                pressed && styles.pressed,
            ]}
        >
            <Card
                padding={spacing.md}
                style={styles.card}
            >
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor:
                                `${config.color}15`,
                        },
                    ]}
                >
                    <Icon
                        name={config.icon}
                        size={18}
                        color={config.color}
                    />
                </View>

                <AppText
                    variant="caption"
                    weight="600"
                    numberOfLines={1}
                    style={styles.name}
                >
                    {account.name}
                </AppText>

                <AppText
                    variant="heading"
                    weight="700"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                >
                    {formatCompactCurrency(
                        account.balance
                    )}
                </AppText>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 135,
        minHeight: 96,

        borderRadius: radius.lg,

        justifyContent: "space-between",
    },

    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: spacing.sm,
    },

    name: {
        marginBottom: spacing.xs,
    },

    pressed: {
        opacity: 0.85,
        transform: [
            {
                scale: 0.97,
            },
        ],
    },
});