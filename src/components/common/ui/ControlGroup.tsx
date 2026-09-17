import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Body, Caption,} from "../../typography";

import {colors, radius, spacing,} from "../../../design";

export interface ControlItem {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    active?: boolean;
}

interface ControlGroupProps {
    controls: ControlItem[];
}

export const ControlGroup = ({
                                 controls,
                             }: ControlGroupProps) => {
    return (
        <View style={styles.container}>
            {controls.map((control) => (
                <Pressable
                    key={control.label}
                    onPress={control.onPress}
                    style={[
                        styles.control,
                        control.active && styles.controlActive,
                    ]}
                >
                    <View
                        style={[
                            styles.iconContainer,
                            control.active &&
                            styles.iconContainerActive,
                        ]}
                    >
                        <Ionicons
                            name={control.icon}
                            size={18}
                            color={
                                control.active
                                    ? colors.text
                                    : colors.textSecondary
                            }
                        />
                    </View>

                    <View style={styles.content}>
                        <Caption color="muted">
                            {control.label}
                        </Caption>

                        <Body
                            numberOfLines={1}
                            style={styles.value}
                        >
                            {control.value}
                        </Body>
                    </View>

                    <Ionicons
                        name="chevron-down"
                        size={16}
                        color={colors.textSecondary}
                    />
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },

    control: {
        flex: 1,
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },

    controlActive: {
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

    iconContainerActive: {
        backgroundColor: colors.surface,
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    value: {
        marginTop: 2,
    },
});