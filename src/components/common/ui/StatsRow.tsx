import React from "react";
import {StyleSheet, View} from "react-native";
import {StatChip} from "./StatChip";

interface StatItem {
    label: string;
    value: number;
    color?: string;
}

interface Props {
    items: StatItem[];
}

export const StatsRow = ({items}: Props) => {

    if (!items?.length) return null;

    return (
        <View style={styles.row}>

            {items.map((item, index) => (

                <View
                    key={index}
                    style={styles.item}
                >

                    <StatChip
                        label={item.label}
                        value={`₹${item.value.toLocaleString()}`}
                        color={item.color}
                    />

                </View>

            ))}

        </View>
    );
};

const styles = StyleSheet.create({

    row: {
        flexDirection: "row",
        gap: 12,
        marginTop: 12
    },

    item: {
        flex: 1
    }

});