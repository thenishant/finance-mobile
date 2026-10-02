import React from "react";
import {StyleSheet, View} from "react-native";
import {StatChip} from "./StatChip";
import {spacing} from "../../../design";
import {formatCurrency} from "../../../utils/currency";

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
                        value={formatCurrency(item.value)}
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
        gap: spacing.md,
        marginTop: spacing.md
    },

    item: {
        flex: 1
    }

});