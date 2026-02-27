import React, {useEffect, useRef} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Feather} from "@expo/vector-icons";

interface Props {
    month: number;
    year: number;
    onChange: (year: number, month: number) => void;
    scrollY: Animated.Value;
    comparison?: any;
}

const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

export const MonthSelector = ({
                                  month,
                                  year,
                                  onChange,
                                  scrollY,
                                  comparison,
                              }: Props) => {

    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start();
    }, [month, year]);

    const now = new Date();
    const isFuture =
        year > now.getFullYear() ||
        (year === now.getFullYear() && month > now.getMonth() + 1);

    const goPrevious = () => {
        if (month === 1) onChange(year - 1, 12);
        else onChange(year, month - 1);
    };

    const goNext = () => {
        if (isFuture) return;

        if (month === 12) onChange(year + 1, 1);
        else onChange(year, month + 1);
    };

    const shadowOpacity = scrollY.interpolate({
        inputRange: [0, 20],
        outputRange: [0, 0.12],
        extrapolate: "clamp",
    });

    const bgOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0.85, 1],
        extrapolate: "clamp",
    });

    const trendPercent = comparison?.change?.expense?.percent;

    const trendColor =
        trendPercent > 0 ? "#EF4444" :
            trendPercent < 0 ? "#10B981" :
                "#9CA3AF";

    const trendIcon =
        trendPercent > 0 ? "trending-up" :
            trendPercent < 0 ? "trending-down" :
                "minus";

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    shadowOpacity,
                    backgroundColor: "rgba(255,255,255,0.95)",
                },
            ]}
        >
            <TouchableOpacity onPress={goPrevious}>
                <Feather name="chevron-left" size={22} color="#6B7280"/>
            </TouchableOpacity>

            <Animated.View style={{opacity: fadeAnim}}>
                <View style={styles.centerBlock}>
                    <Text style={styles.label}>
                        {monthNames[month - 1]} {year}
                    </Text>

                    {trendPercent !== undefined && (
                        <View style={styles.trendRow}>
                            <Feather
                                name={trendIcon}
                                size={14}
                                color={trendColor}
                            />
                            <Text style={[styles.trendText, {color: trendColor}]}>
                                {Math.abs(trendPercent)}%
                            </Text>
                        </View>
                    )}
                </View>
            </Animated.View>

            <TouchableOpacity
                onPress={goNext}
                disabled={isFuture}
                style={{opacity: isFuture ? 0.3 : 1}}
            >
                <Feather name="chevron-right" size={22} color="#6B7280"/>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
        elevation: 6,
        shadowColor: "#000",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        textAlign: "center",
    },
    centerBlock: {
        alignItems: "center",
    },
    trendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },
    trendText: {
        fontSize: 12,
        fontWeight: "500",
    },
});