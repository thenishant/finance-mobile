import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const ProgressBar = ({progressPercent, color}: any) => {

    return (
        <>
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressFill,
                        {width: `${progressPercent}%`, backgroundColor: color}
                    ]}
                />
            </View>

            <Text style={styles.progressText}>
                {progressPercent}% of goal reached
            </Text>
        </>
    );
};

const styles = StyleSheet.create({

    progressContainer: {
        height: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 6
    },

    progressFill: {
        height: "100%"
    },

    progressText: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 16
    }

});