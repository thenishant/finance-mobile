import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
    label: string;
    value: string;
    color?: string;
}

export const StatChip = ({
                             label,
                             value,
                             color = "#111827"
                         }: Props) => {

    return (
        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={[styles.value, {color}]}>
                {value}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        padding: 14
    },

    label: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 4
    },

    value: {
        fontSize: 16,
        fontWeight: "700"
    }

});