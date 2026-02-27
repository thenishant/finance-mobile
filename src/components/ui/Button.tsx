import React from "react";
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from "react-native";
import {colors} from "../../design/colors";

interface Props {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button = ({
                           title,
                           onPress,
                           variant = "primary",
                           disabled,
                           style,
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
            <Text
                style={[
                    styles.text,
                    variant !== "primary" && styles.secondaryText,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
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