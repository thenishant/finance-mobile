import React, {useEffect, useRef} from "react";
import {Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import {useMonthStore} from "../../stores/useMonthStore";
import {monthNames} from "../../utils/months";

interface Props {
    comparison?: any;
    scrollY?: Animated.Value;
}

export const MonthSelector = ({scrollY, comparison}: Props) => {

    const year = useMonthStore(s => s.year);
    const month = useMonthStore(s => s.month);
    const prevMonth = useMonthStore(s => s.prevMonth);
    const nextMonth = useMonthStore(s => s.nextMonth);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true
            })
        ]).start();
    }, [month, year]);

    const now = new Date();

    const isFuture =
        year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1);

    const goPrevious = () => prevMonth();

    const goNext = () => {
        if (isFuture) return;
        nextMonth();
    };

    // Swipe detection
    const panResponder = useRef(
        PanResponder.create({

            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dx) > 30,

            onPanResponderRelease: (_, gestureState) => {

                if (gestureState.dx > 60) {
                    goPrevious();
                }

                if (gestureState.dx < -60 && !isFuture) {
                    goNext();
                }
            }

        })
    ).current;

    const opacity = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        })
        : 1;

    const trendPercent =
        comparison?.change?.expense?.percent ?? null;

    const trendColor =
        trendPercent === null
            ? "#9CA3AF"
            : trendPercent > 0
                ? "#EF4444"
                : trendPercent < 0
                    ? "#10B981"
                    : "#9CA3AF";

    const trendIcon =
        trendPercent === null
            ? "minus"
            : trendPercent > 0
                ? "trending-up"
                : trendPercent < 0
                    ? "trending-down"
                    : "minus";

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    opacity,
                    backgroundColor: "rgba(255,255,255,0.95)"
                }
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

                    {trendPercent !== null && (
                        <View style={styles.trendRow}>
                            <Feather
                                name={trendIcon as any}
                                size={14}
                                color={trendColor}
                            />
                            <Text style={[
                                styles.trendText,
                                {color: trendColor}
                            ]}>
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    centerBlock: {
        alignItems: "center",
    },

    trendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    trendText: {
        fontSize: 12,
        marginLeft: 4,
    },

});