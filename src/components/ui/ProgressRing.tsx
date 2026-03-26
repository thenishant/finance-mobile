import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, Text, View} from "react-native";
import Svg, {Circle} from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing = ({goal}: any) => {

    const animated = useRef(new Animated.Value(0)).current;

    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const percent = goal.percent ?? 0;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: percent,
            duration: 500,
            useNativeDriver: false
        }).start();
    }, [percent]);

    const strokeDashoffset = animated.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0]
    });

    return (
        <View style={styles.container}>

            <Svg width={size} height={size}>

                <Circle
                    stroke="#E5E7EB"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />

                <AnimatedCircle
                    stroke="#10B981"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />

            </Svg>

            <View style={styles.center}>
                <Text style={styles.percent}>
                    {percent}%
                </Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16
    },

    center: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center"
    },

    percent: {
        fontSize: 20,
        fontWeight: "700"
    }

});