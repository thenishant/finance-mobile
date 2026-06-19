import React, {useRef} from "react";
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


    const isDark = variant === "dark";

    /* =============================
       THEME
    ============================== */

    const textColor = isDark ? "#F9FAFB" : "#111827";
    const iconColor = isDark ? "#D1D5DB" : "#6B7280";


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
            style={styles.container}
        >

            {/* LEFT */}
            <View style={styles.side}>
                <TouchableOpacity onPress={goPrevious}>
                    <Feather name="chevron-left" size={22} color={iconColor}/>
                </TouchableOpacity>
            </View>

            {/* CENTER */}
            <View style={styles.center}>
                <View style={styles.pill}>

                    <Text style={[styles.label, {color: textColor}]}>
                        {monthNames[month - 1]} {year}
                    </Text>

                    {trendPercent !== null && (
                        <View style={[styles.trendBadge, {backgroundColor: `${trendColor}15`}]}>
                            <Feather
                                name={trendIcon as any}
                                size={12}
                                color={trendColor}
                            />

                            <Text style={[styles.trendText, {color: trendColor}]}>
                                {Math.abs(trendPercent)}%
                            </Text>
                        </View>
                    )}

                </View>
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
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        backgroundColor: "transparent",
    },

    side: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    center: {
        flex: 6,
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 16,
        fontWeight: "700",
    },

    trendText: {
        fontSize: 11,
        fontWeight: "700",
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },

    trendBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
});