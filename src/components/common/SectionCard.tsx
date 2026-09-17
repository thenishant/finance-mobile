import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import AppCard from "../../ui/AppCard";

import {Body, Heading,} from "../typography";

import {colors, spacing,} from "../../design";

interface SectionCardProps {
    title?: string;
    actionLabel?: string;
    onActionPress?: () => void;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export default function SectionCard({
                                        title,
                                        actionLabel,
                                        onActionPress,
                                        footer,
                                        children,
                                    }: SectionCardProps) {
    const hasHeader = !!title || !!actionLabel;

    return (
        <AppCard style={!hasHeader ? styles.noHeader : undefined}>
            {hasHeader && (
                <View style={styles.header}>
                    {!!title && (
                        <Heading>
                            {title}
                        </Heading>
                    )}

                    {!!actionLabel && (
                        <Pressable
                            onPress={onActionPress}
                            hitSlop={10}>
                            <Body
                                color="primary"
                                weight="medium">
                                {actionLabel}
                            </Body>
                        </Pressable>
                    )}
                </View>
            )}
            {children}
            {!!footer && (
                <View style={styles.footer}>
                    {footer}
                </View>
            )}
        </AppCard>
    );
}

const styles = StyleSheet.create({
    noHeader: {
        paddingVertical: spacing.xs,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: spacing.xs,
        paddingTop: spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
});