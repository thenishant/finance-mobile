import React, {useState} from "react";
import {Pressable, StyleSheet, View,} from "react-native";
import {Feather} from "@expo/vector-icons";

import {Body, Caption} from "../../../components/typography";
import {colors, radius, spacing} from "../../../design";
import {formatCurrency} from "../../../utils/currency";

interface Child {
    id: string;
    name: string;
    total: number;
}

interface Props {
    category: string;
    total: number;
    percent: number;
    children: Child[];
}

export const CategoryItem = ({
                                 category,
                                 total,
                                 percent,
                                 children,
                             }: Props) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.card}>
            <Pressable
                onPress={() => setExpanded(!expanded)}
                accessibilityRole="button"
            >
                <View style={styles.header}>
                    <View>
                        <Body weight="semibold">
                            {category}
                        </Body>
                        <Caption color="textSecondary">
                            {percent.toFixed(0)}%
                        </Caption>
                    </View>

                    <View style={styles.right}>
                        <Body weight="semibold">
                            {formatCurrency(total)}
                        </Body>
                        <Feather
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color={colors.textMuted}
                        />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.barBackground}>
                    <View
                        style={[
                            styles.barFill,
                            {width: `${percent}%`},
                        ]}
                    />
                </View>
            </Pressable>

            {expanded &&
                children.map((child) => (
                    <View key={child.id} style={styles.childRow}>
                        <Caption color="textSecondary">
                            {child.name}
                        </Caption>
                        <Caption weight="medium">
                            {formatCurrency(child.total)}
                        </Caption>
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    right: {
        alignItems: "flex-end",
        gap: spacing.xs,
    },
    barBackground: {
        height: 6,
        backgroundColor: colors.overlayMedium,
        borderRadius: radius.xs,
        marginTop: spacing.sm,
        overflow: "hidden",
    },
    barFill: {
        height: 6,
        backgroundColor: colors.primary,
        borderRadius: radius.xs,
    },
    childRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
});
