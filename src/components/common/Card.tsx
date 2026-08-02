import React from "react";
import {StyleProp, StyleSheet, View, ViewProps, ViewStyle,} from "react-native";
import {colors, radius, shadows, spacing} from "../../design";

type Props = ViewProps & {
    style?: StyleProp<ViewStyle>;
    padding?: number;
};

export default function Card({
                                 children,
                                 style,
                                 padding = spacing.md,
                                 ...props
                             }: Props) {
    return (
        <View
            {...props}
            style={[
                styles.card,
                {
                    padding,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        ...shadows.card,
    },
});