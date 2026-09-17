import React from "react";
import {StyleSheet, View} from "react-native";
import {formatCurrency} from "../../../utils/currency";
import {colors, spacing} from "../../../design";
import {AppText} from "../../../components/common";

type SummaryRowProps = {
    label: string;
    value: number;
    color: string;
};

export default function SummaryRow({
                                       label,
                                       value,
                                       color,
                                   }: SummaryRowProps) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View
                    style={[
                        styles.indicator,
                        {
                            backgroundColor: color,
                        },
                    ]}
                />

                <AppText
                    variant="caption"
                    color={colors.textSecondary}
                >
                    {label}
                </AppText>
            </View>

            <AppText variant="body" weight="600">
                {formatCurrency(value)}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
});