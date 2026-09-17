import React from "react";
import {Pressable, PressableProps, StyleProp, StyleSheet, View, ViewProps, ViewStyle,} from "react-native";

import {colors, radius, shadows, spacing,} from "../../design";

export interface CardProps
    extends Omit<ViewProps, "style"> {

    children: React.ReactNode;

    style?: StyleProp<ViewStyle>;

    contentStyle?: StyleProp<ViewStyle>;

    onPress?: PressableProps["onPress"];

    elevated?: boolean;

    padding?: keyof typeof spacing;
}

export default function Card({

                                 children,

                                 style,

                                 contentStyle,

                                 onPress,

                                 elevated = true,

                                 padding = "xl",

                                 ...props

                             }: CardProps) {

    const content = (
        <View
            {...props}
            style={[
                styles.card,
                elevated && shadows.card,
                {
                    padding: spacing[padding],
                },
                contentStyle,
            ]}
        >
            {children}
        </View>
    );

    if (!onPress) {
        return (
            <View style={style}>
                {content}
            </View>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                style,
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
        borderWidth: 1,
        borderColor: colors.border,
    },

    pressed: {
        opacity: 0.92,
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

});