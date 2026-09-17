import React from "react";
import {Pressable, StyleProp, StyleSheet, View, ViewStyle,} from "react-native";

import {spacing} from "../../design";

interface ListRowProps {

    left?: React.ReactNode;

    title: React.ReactNode;

    subtitle?: React.ReactNode;

    trailing?: React.ReactNode;

    bottom?: React.ReactNode;

    onPress?: () => void;

    style?: StyleProp<ViewStyle>;
}

export default function ListRow({
                                    left,
                                    title,
                                    subtitle,
                                    trailing,
                                    bottom,
                                    onPress,
                                    style,
                                }: ListRowProps) {

    const content = (

        <View style={[styles.container, style]}>

            <View style={styles.topRow}>

                {left && (
                    <View style={styles.left}>
                        {left}
                    </View>
                )}

                <View style={styles.center}>

                    {title}

                    {subtitle && (
                        <View style={styles.subtitle}>
                            {subtitle}
                        </View>
                    )}

                </View>

                {trailing && (
                    <View style={styles.trailing}>
                        {trailing}
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

    container: {
        paddingVertical: spacing.md,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    left: {
        marginRight: spacing.md,
    },

    center: {
        flex: 1,
    },

    subtitle: {
        marginTop: spacing.xs,
    },

    trailing: {
        marginLeft: spacing.md,
        alignItems: "flex-end",
    },

    bottom: {
        marginTop: spacing.sm,
    },

    pressed: {
        opacity: 0.7,
    },

});