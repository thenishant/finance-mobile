import React from "react";
import {Pressable, PressableProps, StyleProp, StyleSheet, View, ViewProps, ViewStyle,} from "react-native";

import {colors, radius, shadows, spacing} from "../design";

export interface AppCardProps extends ViewProps {
    children: React.ReactNode;

    style?: StyleProp<ViewStyle>;

    onPress?: PressableProps["onPress"];
}

export default function AppCard({
                                    children,
                                    style,
                                    onPress,
                                    ...props
                                }: AppCardProps) {
    const content = (
        <View
            {...props}
            style={[
                styles.card,
                style,
            ]}
        >
            {children}
        </View>
    );

    if (!onPress) {
        return content;
    }

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                pressed && styles.pressed,
            ]}
        >
            {content}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        ...shadows.card,
    },

    pressed: {
        opacity: 0.9,
    },
});