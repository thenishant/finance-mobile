import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {monthNames} from "../../utils/months";

const statusLabels: Record<string, string> = {
    green: "Goal Achieved",
    yellow: "On Track",
    orange: "Needs Attention",
    red: "No Progress"
};

const statusColors: Record<string, string> = {
    green: "#10B981",
    yellow: "#F59E0B",
    orange: "#FB923C",
    red: "#EF4444"
};

export const Header = ({month, status}: any) => {

    const monthIndex = (month ?? 1) - 1;

    return (
        <View style={styles.headerRow}>

            <Text style={styles.title}>
                {monthNames[monthIndex]} {new Date().getFullYear()}
            </Text>

            <View
                style={[
                    styles.statusBadge,
                    {backgroundColor: statusColors[status] + "22"}
                ]}
            >

                <View
                    style={[
                        styles.statusDot,
                        {backgroundColor: statusColors[status]}
                    ]}
                />

                <Text
                    style={[
                        styles.statusText,
                        {color: statusColors[status]}
                    ]}
                >
                    {statusLabels[status]}
                </Text>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },

    title: {
        fontSize: 18,
        fontWeight: "700"
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600"
    }

});