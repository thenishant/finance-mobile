import React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from "react-native";

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
            placeholderTextColor="#9CA3AF"
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#F3F4F6",
        borderRadius: 16,
        padding: 20,
        fontSize: 15,
    },
    disabled: {
        opacity: 0.6,
    },
});