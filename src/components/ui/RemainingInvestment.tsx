import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface Props {
    remaining: number;
}

export const RemainingInvestment = ({remaining}: Props) => {

    return (
        <View style={styles.card}>

            <Text style={styles.label}>
                Remaining
            </Text>

            <Text style={styles.value}>
                ₹{remaining.toLocaleString()}
            </Text>

            <Text style={styles.hint}>
                {remaining === 0
                    ? "Goal achieved 🎉"
                    : "left to reach goal"}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({

    card: {
        marginTop: 12,
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        alignItems: "center"
    },

    label: {
        fontSize: 12,
        color: "#92400E",
        marginBottom: 4
    },

    value: {
        fontSize: 26,
        fontWeight: "700",
        color: "#92400E"
    },

    hint: {
        fontSize: 12,
        color: "#92400E",
        marginTop: 2
    }

});