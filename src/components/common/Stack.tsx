import React from "react";
import {StyleSheet, View, ViewProps, ViewStyle,} from "react-native";
import {spacing} from "../../design";

type Spacing = keyof typeof spacing;

type Props = ViewProps & {
    direction?: "vertical" | "horizontal";
    spacing?: Spacing;
    align?: ViewStyle["alignItems"];
    justify?: ViewStyle["justifyContent"];
};

export default function Stack({
                                  children,
                                  direction = "vertical",
                                  spacing: spacingKey = "md",
                                  align,
                                  justify,
                                  style,
                                  ...props
                              }: Props) {
    const childrenArray = React.Children.toArray(children);

    return (
        <View
            {...props}
            style={[
                direction === "vertical"
                    ? styles.vertical
                    : styles.horizontal,
                {
                    alignItems: align,
                    justifyContent: justify,
                    gap: spacing[spacingKey],
                },
                style,
            ]}
        >
            {childrenArray}
        </View>
    );
}

const styles = StyleSheet.create({
    vertical: {
        flexDirection: "column",
    },
    horizontal: {
        flexDirection: "row",
    },
});