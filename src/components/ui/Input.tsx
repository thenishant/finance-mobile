import React from "react";
import {StyleSheet, TextInput, TextInputProps} from "react-native";

export const Input = (props: TextInputProps) => {
    return (
        <TextInput
            {...props}
            style={[styles.input, props.style]}
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
});