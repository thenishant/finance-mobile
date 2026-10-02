import React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from "react-native";
import {colors} from "../../../design/colors";

type Props = TextInputProps & {
    disabled?: boolean;
};

export const Input = ({disabled, style, ...props}: Props) => {
    return (
        <TextInput
            {...props}
            editable={!disabled}
            style={[
                styles.input,
                disabled && styles.disabled,
                style,
            ]}
            placeholderTextColor={colors.textMuted}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        fontSize: 15,
    },
    disabled: {
        opacity: 0.6,
    },
});