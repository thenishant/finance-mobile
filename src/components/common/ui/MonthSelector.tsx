import React, {useRef} from "react";
import {ActivityIndicator, PanResponder, Pressable, StyleSheet, View} from "react-native";

import {AppText, Icon} from "../";
import {colors, spacing} from "../../../design";
import {useMonthStore} from "../../../stores/useMonthStore";
import {monthNames} from "../../../utils/months";

type Props = {
    trend?: number | null;
    variant?: "light" | "dark";
    loading?: boolean;
};

export default function MonthSelector({
                                          trend,
                                          variant = "light",
                                          loading = false,
                                      }: Props) {
    const year = useMonthStore((s) => s.year);
    const month = useMonthStore((s) => s.month);
    const prevMonth = useMonthStore((s) => s.prevMonth);
    const nextMonth = useMonthStore((s) => s.nextMonth);

    const dark = variant === "dark";

    const textColor = dark ? colors.white : colors.text;
    const iconColor = dark ? colors.darkGrey : colors.muted;

    const now = new Date();

    const canGoNext =
        year < now.getFullYear() ||
        (year === now.getFullYear() &&
            month < now.getMonth() + 1);

    const previous = () => prevMonth();

    const next = () => {
        if (canGoNext) {
            nextMonth();
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dx) > 30,

            onPanResponderRelease: (_, g) => {
                if (loading) {
                    return;
                }
                if (g.dx > 60) {
                    previous();
                } else if (g.dx < -60) {
                    next();
                }
            },
        })
    ).current;

    // const trend = comparison?.change?.expense?.percent;

    const trendColor =
        trend == null
            ? colors.grey
            : trend > 0
                ? colors.red
                : trend < 0
                    ? colors.green
                    : colors.grey;

    const trendIcon =
        trend == null
            ? "remove-outline"
            : trend > 0
                ? "trending-up-outline"
                : trend < 0
                    ? "trending-down-outline"
                    : "remove-outline";

    return (
        <View
            {...panResponder.panHandlers}
            style={styles.container}
        >
            <Pressable
                style={styles.button}
                onPress={previous}
                disabled={loading}
                hitSlop={8}
            >
                <Icon
                    name="chevron-back"
                    size={22}
                    color={iconColor}
                />
            </Pressable>

            <View style={styles.center}>
                <View style={styles.pill}>
                    <AppText
                        variant="body"
                        weight="700"
                        color={textColor}
                    >
                        {monthNames[month - 1]} {year}
                    </AppText>

                    {loading ? (
                        <ActivityIndicator
                            size="small"
                            color={textColor}
                        />
                    ) : (
                        trend != null && (
                            <View
                                style={[
                                    styles.badge,
                                    {
                                        backgroundColor: `${trendColor}15`,
                                    },
                                ]}
                            >
                                <Icon
                                    name={trendIcon}
                                    size={12}
                                    color={trendColor}
                                />

                                <AppText
                                    variant="small"
                                    weight="700"
                                    color={trendColor}
                                >
                                    {Math.abs(trend)}%
                                </AppText>
                            </View>
                        )
                    )}
                </View>
            </View>

            <Pressable
                style={styles.button}
                onPress={next}
                disabled={!canGoNext || loading}
                hitSlop={8}
            >
                <Icon
                    name="chevron-forward"
                    size={22}
                    color={
                        canGoNext
                            ? iconColor
                            : colors.border
                    }
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },

    button: {
        width: 40,
        alignItems: "center",
    },

    center: {
        flex: 1,
        alignItems: "center",
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 999,
    },
});