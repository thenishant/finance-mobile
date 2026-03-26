import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Feather} from "@expo/vector-icons";

interface Props {
    icon: any;
    label: string;
    value: number;
    percent?: number | null;
    color: string;
    formatCurrency: (value: number) => string;
    onPress?: () => void;
}

export const StatBlock = ({icon, label, value, percent, color, formatCurrency, onPress}: Props) => {

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.statBlock,
                pressed && styles.pressed
            ]}
        >
            <View style={[styles.iconContainer, {backgroundColor: `${color}15`}]}>
                <Feather name={icon} size={16} color={color}/>
            </View>

            <Text style={styles.statLabel}>{label}</Text>

            <Text style={[styles.statValue, {color}]}>
                {formatCurrency(value)}
            </Text>

            {percent !== null && percent !== undefined && (
                <Text style={[styles.percentText, {color}]}>
                    {percent > 0 ? "▲" : percent < 0 ? "▼" : "•"}{" "}
                    {Math.abs(percent)}%
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    statBlock: {
        flex: 1,
        alignItems: "center",
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    pressed: {
        opacity: 0.7,
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4
    },
    statValue: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 6,
    },
    percentText: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: "500",
    },
});