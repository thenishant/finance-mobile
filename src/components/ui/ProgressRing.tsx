import React, {useEffect, useRef, useState} from "react";
import {Animated, StyleSheet, Text, View} from "react-native";

export const ProgressRing = ({goal}: any) => {
    const progress = goal?.progress ?? 0;
    const percent = goal?.percent ?? 0;

    const safeProgress = Math.min(progress, 1);

    const animated = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const [displayPercent, setDisplayPercent] = useState(0);

    useEffect(() => {
        // reset animation
        animated.setValue(0);

        const listener = animated.addListener(({value}) => {
            setDisplayPercent(Math.round(value * percent));
        });

        Animated.timing(animated, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
        }).start();

        // 🎉 pop animation when goal achieved
        if (percent >= 100) {
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.08,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        return () => {
            animated.removeAllListeners();
        };
    }, [percent]);

    const isCompleted = percent >= 100;

    const color = isCompleted ? "#10B981" : "#3B82F6";

    return (
        <Animated.View
            style={[
                styles.container,
                {transform: [{scale}]}
            ]}
        >
            {/* Ring Wrapper */}
            <View style={styles.ringWrapper}>

                {/* Background ring */}
                <View style={styles.ringBg}/>

                {/* Progress ring (visual effect only) */}
                <Animated.View
                    style={[
                        styles.ring,
                        {
                            borderColor: color,
                            opacity: animated.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                            }),
                        },
                    ]}
                />

                {/* Center content */}
                <View style={styles.center}>
                    <Text style={[styles.percent, {color}]}>
                        {displayPercent}%
                    </Text>

                    <Text style={styles.label}>
                        invested
                    </Text>
                </View>
            </View>

            {/* 🎉 Badge */}
            {isCompleted && (
                <Text style={styles.badge}>
                    🎉 Goal Achieved
                </Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16
    },

    ringWrapper: {
        width: 140,
        height: 140,
        alignItems: "center",
        justifyContent: "center"
    },

    ringBg: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 12,
        borderColor: "#E5E7EB",
        position: "absolute"
    },

    ring: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 12,
        position: "absolute"
    },

    center: {
        alignItems: "center",
        justifyContent: "center"
    },

    percent: {
        fontSize: 26,
        fontWeight: "700"
    },

    label: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2
    },

    badge: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: "600",
        color: "#10B981"
    }
});