import React from "react";
import {ActivityIndicator, Pressable, PressableProps, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import {colors, radius, shadows, spacing,} from "../../design";
import {Body} from "../typography";

const buttonVariants = {
    primary: {
        backgroundColor: colors.primary,
        borderColor: "transparent",
        textColor: colors.white,
        shadow: shadows.card,
    },

    secondary: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textColor: colors.text,
        shadow: {},
    },

    ghost: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: colors.primary,
        shadow: {},
    },

    danger: {
        backgroundColor: colors.danger,
        borderColor: "transparent",
        textColor: colors.white,
        shadow: {},
    },

} as const;

const buttonSizes = {
    sm: {
        height: 40,
        icon: 18,
        paddingHorizontal: spacing.md,
    },
    md: {
        height: 48,
        icon: 20,
        paddingHorizontal: spacing.lg,
    },
    lg: {
        height: 56,
        icon: 24,
        paddingHorizontal: spacing.xl,
    },
} as const;
type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;
type IconName = keyof typeof Ionicons.glyphMap;
type ButtonProps = {
    title?: string;
    children?: React.ReactNode;
} & ButtonSharedProps;

interface ButtonSharedProps extends Omit<PressableProps, "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: IconName;
    rightIcon?: IconName;
    icon?: IconName;
    iconOnly?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: radius.md,
        gap: spacing.sm,
    },
    fullWidth: {width: "100%"},
    pressed: {opacity: 0.8},
    disabled: {opacity: 0.45},
});

export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  children,
                                                  variant = "primary",
                                                  size = "md",
                                                  leftIcon,
                                                  rightIcon,
                                                  icon,
                                                  iconOnly = false,
                                                  loading = false,
                                                  fullWidth = false,
                                                  disabled,
                                                  style,
                                                  ...props
                                              }) => {

    const variantStyle = buttonVariants[variant];
    const sizeStyle = buttonSizes[size];

    return (
        <Pressable
            {...props}
            disabled={
                disabled ||
                loading
            }
            accessibilityRole="button"
            style={({pressed}) => [
                styles.button,
                {
                    backgroundColor: variantStyle.backgroundColor,
                    borderColor: variantStyle.borderColor,
                    minHeight: sizeStyle.height,
                    paddingHorizontal: sizeStyle.paddingHorizontal,

                },
                variantStyle.shadow,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variantStyle.textColor}/>
            ) : (
                <>
                    {leftIcon &&
                        !iconOnly && (
                            <Ionicons
                                name={leftIcon}
                                size={sizeStyle.icon}
                                color={variantStyle.textColor}
                            />
                        )}
                    {iconOnly ? (icon && (
                            <Ionicons
                                name={icon}
                                size={
                                    sizeStyle.icon
                                }
                                color={
                                    variantStyle.textColor
                                }/>
                        )
                    ) : children ? (
                        children
                    ) : (
                        <Body
                            weight="semibold"
                            style={{
                                color:
                                variantStyle.textColor,
                            }}>
                            {title}
                        </Body>
                    )}
                    {rightIcon &&
                        !iconOnly && (
                            <Ionicons
                                name={rightIcon}
                                size={
                                    sizeStyle.icon
                                }
                                color={
                                    variantStyle.textColor
                                }
                            />
                        )}
                </>
            )}
        </Pressable>
    );
};