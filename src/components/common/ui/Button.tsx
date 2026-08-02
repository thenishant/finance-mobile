import React from "react";
import {Pressable, StyleSheet, Text, View, ViewStyle,} from "react-native";
import {colors} from "../../../design";

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
                           disabled = false,
                           style,
                           leftIcon,
                       }: Props) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({pressed}) => [
                styles.base,
                styles[variant],
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
                style
            ]}>
            <View style={styles.row}>
                {leftIcon && (<View style={styles.icon}>{leftIcon}</View>)}

                <Text
                    style={[
                        styles.text,
                        variant !== "primary" &&
                        styles.darkText,
                    ]}>{title}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        height: 54,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
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

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 3,
    },
    secondary: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    ghost: {
        backgroundColor: "transparent",
    },
    text: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.white,
        letterSpacing: 0.2,
    },
    darkText: {
        color: colors.darkBackground,
    },
    pressed: {
        opacity: 0.9,
        transform: [{scale: 0.98}],
    },
    disabled: {
        opacity: 0.45,
    },
});