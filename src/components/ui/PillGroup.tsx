import React, {useEffect, useRef, useState} from "react";
import {Animated, LayoutChangeEvent, ScrollView, StyleSheet, Text, View,} from "react-native";
import {Pill} from "./Pill";
import {colors} from "../../design/colors";

type Props<T extends string> = {
    label?: string;
    required?: boolean;
    data: readonly T[];
    value: T;
    onChange: (value: T) => void;
};

export function PillGroup<T extends string>({
                                                label,
                                                required,
                                                data,
                                                value,
                                                onChange,
                                            }: Props<T>) {
    const scrollRef = useRef<ScrollView>(null);

    const indicatorX = useRef(new Animated.Value(0)).current;
    const indicatorWidth = useRef(new Animated.Value(0)).current;

    const [layouts, setLayouts] = useState<
        Record<string, { x: number; width: number }>
    >({});

    const handleLayout =
        (item: string) =>
            (e: LayoutChangeEvent) => {
                const {x, width} = e.nativeEvent.layout;

                setLayouts((prev) => ({
                    ...prev,
                    [item]: {x, width},
                }));
            };

    useEffect(() => {
        const layout = layouts[value];
        if (!layout || !scrollRef.current) return;

        scrollRef.current.scrollTo({
            x: Math.max(layout.x - 40, 0),
            animated: true,
        });

        Animated.parallel([
            Animated.spring(indicatorX, {
                toValue: layout.x,
                useNativeDriver: false,
            }),
            Animated.spring(indicatorWidth, {
                toValue: layout.width,
                useNativeDriver: false,
            }),
        ]).start();
    }, [value, layouts]);

    return (
        <View style={styles.containerWrapper}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <View style={styles.wrapper}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToAlignment="start"
                    contentContainerStyle={styles.scrollContainer}
                >
                    {data.map((item) => (
                        <View key={item} onLayout={handleLayout(item)}>
                            <Pill
                                label={item}
                                active={value === item}
                                onPress={() => onChange(item)}
                            />
                        </View>
                    ))}

                    <Animated.View
                        style={[
                            styles.indicator,
                            {
                                transform: [{translateX: indicatorX}],
                                width: indicatorWidth,
                            },
                        ]}
                    />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerWrapper: {
        marginTop: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    required: {
        color: colors.primary,
    },
    wrapper: {
        overflow: "hidden",
    },
    scrollContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    indicator: {
        position: "absolute",
        bottom: 0,
        height: 0,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
});