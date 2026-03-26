import React from "react";
import {StyleSheet, View} from "react-native";

export const DashboardSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.hero}/>
            <View style={styles.card}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    hero: {
        height: 120,
        backgroundColor: "#E5E7EB",
        borderRadius: 20,
        marginBottom: 20,
    },
    card: {
        height: 100,
        backgroundColor: "#E5E7EB",
        borderRadius: 20,
    },
});