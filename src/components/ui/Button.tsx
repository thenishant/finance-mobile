import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, ViewStyle,} from "react-native";
import {colors} from "../../design/colors";

interface Props {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
    style?: ViewStyle;
    leftIcon?: React.ReactNode;
}

export const Button = ({
                           title,
                           onPress,
                           variant = "primary",
                           disabled,
                           style,
                           leftIcon,
                       }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.base,
                styles[variant],
                disabled && {opacity: 0.5},
                style,
            ]}
        >
            <View style={styles.row}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

                <Text
                    style={[
                        styles.text,
                        variant !== "primary" && styles.secondaryText,
                    ]}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignSelf: "stretch",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    icon: {
        marginRight: 8,
    },

    primary: {
        backgroundColor: colors.primary,
    },

    secondary: {
        backgroundColor: "#F3F4F6",
    },

    ghost: {
        backgroundColor: "transparent",
    },

    text: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },

    secondaryText: {
        color: "#111827",
    },
});