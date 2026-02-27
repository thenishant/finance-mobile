import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity} from "react-native";

interface Props {
    visible: boolean;
    onUndo: () => void;
}

export const TransactionSnackbar = ({
                                        visible,
                                        onUndo,
                                    }: Props) => {
    const anim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: visible ? 0 : 100,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {transform: [{translateY: anim}]},
            ]}
        >
            <Text style={styles.text}>
                Transaction deleted
            </Text>

            <TouchableOpacity onPress={onUndo}>
                <Text style={styles.undo}>
                    UNDO
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#111827",
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 13,
    },
    undo: {
        color: "#60A5FA",
        fontWeight: "600",
    },
});