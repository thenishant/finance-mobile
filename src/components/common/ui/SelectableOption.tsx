import React from "react";
import {
    Pressable,
    StyleSheet,
    View,
} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Body} from "../../typography";

import {
    colors,
    radius,
    shadows,
    spacing,
} from "../../../design";

import {FinanceIcon} from "../../../design/icons";

interface SelectableOptionProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    icon?: FinanceIcon;
}

export const SelectableOption = ({
                                     label,
                                     selected,
                                     onPress,
                                     icon,
                                 }: SelectableOptionProps) => {
    const iconColor =
        icon?.color ?? colors.textSecondary;

    const iconBackground =
        icon?.background ??
        `${colors.textSecondary}15`;

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.option,
                selected &&
                styles.optionSelected,
                selected &&
                icon && {
                    borderColor: icon.color,
                },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor:
                        iconBackground,
                    },
                ]}
            >
                <Ionicons
                    name={
                        icon?.icon ??
                        "layers-outline"
                    }
                    size={18}
                    color={iconColor}
                />
            </View>

            <Body
                numberOfLines={1}
                style={[
                    styles.label,
                    selected &&
                    icon && {
                        color: icon.color,
                    },
                ]}
            >
                {label}
            </Body>

            {selected && (
                <View
                    style={[
                        styles.checkContainer,
                        {
                            backgroundColor:
                                icon?.background ??
                                `${colors.text}15`,
                        },
                    ]}
                >
                    <Ionicons
                        name="checkmark"
                        size={13}
                        color={iconColor}
                    />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    option: {
        minHeight: 48,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,

        borderRadius: radius.lg,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        ...shadows.card,
    },

    optionSelected: {
        backgroundColor: colors.surface,
    },

    iconContainer: {
        width: spacing.xxl,
        height: spacing.xxl,

        borderRadius: spacing.sm,

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.xs,
    },

    label: {
        color: colors.textSecondary,
    },

    checkContainer: {
        width: 20,
        height: 20,

        borderRadius: 10,

        justifyContent: "center",
        alignItems: "center",

        marginLeft: spacing.xs,
    },
});