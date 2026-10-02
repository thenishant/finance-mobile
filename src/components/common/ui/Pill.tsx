import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from "react-native";

type Props = {
    label: string;
    active?: boolean;
    backgroundColor?: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

import {colors, radius, spacing} from "../../../design";

const PRIMARY = colors.primary;
const INACTIVE_BG = colors.overlayMedium;
const INACTIVE_TEXT = colors.textSecondary;

export const Pill: React.FC<Props> = ({
                                          label,
                                          active = false,
                                          backgroundColor,
                                          onPress,
                                          disabled = false,
                                          style,
                                          textStyle
                                      }) => {

    const handlePress = () => {
        onPress?.();
    };
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.7}
                style={[
                    styles.base,
                    backgroundColor
                        ? {backgroundColor}
                        : active
                            ? styles.active
                            : styles.inactive,
                    disabled && styles.disabled,
                    style
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        active ? styles.activeText : styles.inactiveText,
                        disabled && styles.disabledText,
                        textStyle
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.md,
        paddingHorizontal: 22,
        borderRadius: radius.round,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.sm
    },

    inactive: {
        backgroundColor: INACTIVE_BG
    },

    active: {
        backgroundColor: PRIMARY
    },

    text: {
        fontWeight: "600",
        fontSize: 12
    },

    inactiveText: {
        color: INACTIVE_TEXT
    },

    activeText: {
        color: colors.white
    },

    disabled: {
        opacity: 0.5
    },

    disabledText: {
        color: colors.textMuted
    }
});