import React from "react";
import {StyleSheet, Text, TextProps, TextStyle,} from "react-native";
import {colors, typography} from "../../design";

type Variant =
    | "display"
    | "title"
    | "heading"
    | "body"
    | "caption"
    | "small";

type Props = TextProps & {
    variant?: Variant;
    color?: string;
    weight?: TextStyle["fontWeight"];
};

const variantStyles: Record<Variant, TextStyle> = {
    display: {
        fontSize: typography.display.fontSize,
        fontWeight: "700",
    },
    title: {
        fontSize: typography.title.fontSize,
        fontWeight: "700",
    },
    heading: {
        fontSize: typography.heading.fontSize,
        fontWeight: "600",
    },
    body: {
        fontSize: typography.body.fontSize,
        fontWeight: "400",
    },
    caption: {
        fontSize: typography.caption.fontSize,
        fontWeight: "500",
    },
    small: {
        fontSize: typography.label.fontSize,
        fontWeight: "400",
    },
};

export default function AppText({
                                    variant = "body",
                                    color = colors.text,
                                    weight,
                                    style,
                                    children,
                                    ...props
                                }: Props) {
    return (
        <Text
            {...props}
            style={[
                styles.base,
                variantStyles[variant],
                {
                    color,
                    fontWeight:
                        weight ??
                        variantStyles[variant].fontWeight,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        color: colors.text,
    },
});