import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";

import {Pill} from "./Pill";

export type PillOption<T extends string> = {
    value: T;
    label: string;
};

type Props<T extends string> = {
    data: readonly PillOption<T>[];
    value: T;
    onChange: (value: T) => void;
    variant?: "scroll" | "grid";
};

export function PillGroup<T extends string>({
                                                data,
                                                value,
                                                onChange,
                                                variant = "scroll",
                                            }: Props<T>) {
    return (
        <View
            style={[
                styles.container,
                variant === "grid" &&
                styles.gridContainer,
            ]}
        >
            {data.map((item) => (
                <View
                    key={item.value}
                    style={
                        variant === "grid"
                            ? styles.gridItem
                            : undefined
                    }
                >
                    <Pill
                        label={item.label}
                        active={
                            value === item.value
                        }
                        onPress={() =>
                            onChange(item.value)
                        }
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    gridContainer: {
        gap: 10,
    },

    gridItem: {
        width: "48%",
    },
});