import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Body, Caption,} from "../../typography";

import {colors, radius, spacing,} from "../../../design";

interface Props {
    title: string;
    subtitle?: string;
    selected: boolean;
    onPress: () => void;
}

export const SortOption = ({
                               title,
                               subtitle,
                               selected,
                               onPress,
                           }: Props) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.option,
                selected && styles.selected,
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    selected &&
                    styles.iconContainerSelected,
                ]}
            >
                <Ionicons
                    name={
                        selected
                            ? "checkmark"
                            : "swap-vertical-outline"
                    }
                    size={18}
                    color={
                        selected
                            ? colors.text
                            : colors.textSecondary
                    }
                />
            </View>

            <View style={styles.content}>
                <Body>
                    {title}
                </Body>

                {subtitle && (
                    <Caption color="muted">
                        {subtitle}
                    </Caption>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },

    selected: {
        borderColor: colors.textSecondary,
    },

    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        marginRight: spacing.sm,
    },

    iconContainerSelected: {
        backgroundColor: colors.background,
    },

    content: {
        flex: 1,
    },
});