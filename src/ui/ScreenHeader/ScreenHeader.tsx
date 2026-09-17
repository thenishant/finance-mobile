import React from "react";
import {StyleProp, StyleSheet, Text, View, ViewStyle,} from "react-native";

import {colors, spacing, typography,} from "../../design";

export interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    bottom?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const ScreenHeader = ({
                                 title,
                                 subtitle,
                                 left,
                                 right,
                                 bottom,
                                 style,
                             }: ScreenHeaderProps) => {
    return (
        <View
            style={[
                styles.container,
                style,
            ]}>
            <View style={styles.row}>
                <View style={styles.leftSection}>
                    {left && (
                        <View style={styles.left}>{left}</View>
                    )}
                    <View style={styles.textContainer}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={styles.subtitle}
                                numberOfLines={2}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>
                {right && (
                    <View style={styles.right}>
                        {right}
                    </View>
                )}
            </View>
            {bottom && (
                <View style={styles.bottom}>
                    {bottom}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    left: {
        marginRight: spacing.md,
    },

    textContainer: {
        flex: 1,
    },

    title: {
        ...typography.heading,
        color: colors.text,
    },

    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },

    right: {
        marginLeft: spacing.md,
    },

    bottom: {
        marginTop: spacing.lg,
    },
});

export default ScreenHeader;