import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle,} from "react-native";

import {colors,} from "../../design";

interface ProgressBarProps {

    progress: number;

    color?: string;

    height?: number;

    trackColor?: string;

    style?: StyleProp<ViewStyle>;
}

export default function ProgressBar({
                                        progress,
                                        color = colors.primary,
                                        height = 4,
                                        trackColor = colors.border,
                                        style,
                                    }: ProgressBarProps) {

    const value = Math.min(
        Math.max(progress, 0),
        1,
    );

    return (

        <View
            style={[
                styles.track,
                {
                    height,
                    backgroundColor: trackColor,
                    borderRadius: height / 2,
                },
                style,
            ]}
        >

            <View
                style={{
                    width: `${value * 100}%`,
                    height: "100%",
                    backgroundColor: color,
                    borderRadius: height / 2,
                }}
            />

        </View>

    );
}

const styles = StyleSheet.create({

    track: {
        width: "100%",
        overflow: "hidden",
    },

});