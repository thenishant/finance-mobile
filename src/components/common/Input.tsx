import React from "react";
import {StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle,} from "react-native";

import {colors, radius, spacing,} from "../../design";

export interface InputProps extends TextInputProps {
    error?: boolean;
    inputStyle?: StyleProp<TextStyle>;
}

export default function Input({
                                  error = false,
                                  inputStyle,
                                  style,
                                  ...props
                              }: InputProps) {
    return (
        <TextInput
            {...props}
            style={[
                styles.input,
                error && styles.error,
                style,
                inputStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        minHeight: 48,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        color: colors.text,
        fontSize: 16,
    },

    error: {
        borderColor: colors.danger,
    },
});