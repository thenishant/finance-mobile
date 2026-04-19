import React, {useEffect, useRef} from "react";
import {Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";

import {useMonthStore} from "../../stores/useMonthStore";
import {monthNames} from "../../utils/months";

interface Props {
    comparison?: any;
    scrollY?: Animated.Value;
    variant?: "light" | "dark";
}

export const MonthSelector = ({
                                  scrollY,
                                  comparison,
                                  variant = "light"
                              }: Props) => {

    const year = useMonthStore(s => s.year);
    const month = useMonthStore(s => s.month);
    const prevMonth = useMonthStore(s => s.prevMonth);
    const nextMonth = useMonthStore(s => s.nextMonth);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const isDark = variant === "dark";

    /* =============================
       THEME
    ============================== */

    const bgColor = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.95)";

    const textColor = isDark ? "#F9FAFB" : "#111827";
    const iconColor = isDark ? "#D1D5DB" : "#6B7280";

    /* =============================
       SMOOTH FADE
    ============================== */

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 120,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true
            }).start();
        });
    }, [month, year]);

    /* =============================
       NAVIGATION
    ============================== */

    const now = new Date();

    const isFuture =
        year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1);

    const goPrevious = () => prevMonth();
    const goNext = () => {
        if (!isFuture) nextMonth();
    };

    /* =============================
       SWIPE
    ============================== */

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
            onPanResponderRelease: (_, g) => {
                if (g.dx > 60) goPrevious();
                if (g.dx < -60 && !isFuture) goNext();
            }
        })
    ).current;

    /* =============================
       SCROLL EFFECT
    ============================== */

    const opacity = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        })
        : 1;

    /* =============================
       TREND
    ============================== */

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

    /* =============================
       UI
    ============================== */

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {opacity, backgroundColor: bgColor}
            ]}
        >

            {/* LEFT */}
            <View style={styles.side}>
                <TouchableOpacity onPress={goPrevious}>
                    <Feather name="chevron-left" size={22} color={iconColor}/>
                </TouchableOpacity>
            </View>

            {/* CENTER */}
            <View style={styles.center}>
                <Animated.View style={{opacity: fadeAnim, alignItems: "center"}}>

                    <Text style={[styles.label, {color: textColor}]}>
                        {monthNames[month - 1]} {year}
                    </Text>

                    <View style={styles.trendRow}>
                        {trendPercent !== null ? (
                            <View style={styles.trendContent}>
                                <Feather
                                    name={trendIcon as any}
                                    size={14}
                                    color={trendColor}
                                />
                                <Text style={[styles.trendText, {color: trendColor}]}>
                                    {Math.abs(trendPercent)}%
                                </Text>
                            </View>
                        ) : (
                            <Text style={{opacity: 0}}>0%</Text>
                        )}
                    </View>

                </Animated.View>
            </View>

            {/* RIGHT */}
            <View style={styles.side}>
                <TouchableOpacity
                    onPress={goNext}
                    disabled={isFuture}
                    style={{opacity: isFuture ? 0.3 : 1}}
                >
                    <Feather name="chevron-right" size={22} color={iconColor}/>
                </TouchableOpacity>
            </View>

        </Animated.View>
    );
};

/* =============================
   STYLES
============================= */

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 16,
    },

    side: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    center: {
        flex: 6,
        alignItems: "center",
        justifyContent: "space-between",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        justifyContent: "center",
    },

    trendRow: {
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
    },

    trendContent: {
        flexDirection: "row",
        alignItems: "center",
    },

    trendText: {
        fontSize: 12,
        marginLeft: 4,
    },
});