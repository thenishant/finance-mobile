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

const PRIMARY = "#2563EB";
const INACTIVE_BG = "#F3F4F6";
const INACTIVE_TEXT = "#374151";

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
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8
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
        color: "#FFFFFF"
    },

    disabled: {
        opacity: 0.5
    },

    disabledText: {
        color: "#9CA3AF"
    }
});