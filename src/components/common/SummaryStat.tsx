import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "./AppText";
import Icon, {IconName} from "./Icon";
import {colors, spacing} from "../../design";
import {formatCompactCurrency} from "../../utils/currency";

type Props = {
    title: string;
    value: number;
    icon: IconName;
    color: string;
    percent?: number;
    onPress?: () => void;
};

export default function SummaryStat({
                                        title,
                                        value,
                                        icon,
                                        color,
                                        percent,
                                        onPress,
                                    }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: `${color}15` },
                ]}
            >
                <Icon
                    name={icon}
                    size={16}
                    color={color}
                />
            </View>

            <AppText
                variant="caption"
                color={colors.textSecondary}
                numberOfLines={1}
            >
                {title}
            </AppText>

            <AppText
                variant="body"
                weight="700"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
            >
                {formatCompactCurrency(value)}
            </AppText>

            {percent != null && percent !== 0 && (
                <AppText
                    variant="small"
                    color={percent > 0 ? colors.income : colors.expense}
                >
                    {percent > 0 ? "▲" : "▼"} {Math.abs(percent)}%
                </AppText>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    pressed: {
        opacity: 0.7,
    },
});