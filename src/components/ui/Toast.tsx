import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useToastStore} from "../../stores/useToastStore";

export const Toast = () => {

    const {message} = useToastStore();

    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#111827",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999
    },

    text: {
        color: "#fff",
        fontWeight: "600"
    }

});