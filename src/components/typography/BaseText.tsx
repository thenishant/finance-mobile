import React from "react";
import {StyleProp, Text, TextProps, TextStyle,} from "react-native";

import {colors, typography,} from "../../design";

import {fontWeights} from "../theme/fontWeight";

export type FontWeight = keyof typeof fontWeights;

export type TextColor =
    keyof typeof colors | string;

export interface BaseTextProps
    extends TextProps {

    color?: TextColor;

    weight?: FontWeight;

    align?: TextStyle["textAlign"];

    style?: StyleProp<TextStyle>;
}

export function BaseText({
                             children,
                             color = "text",
                             weight = "regular",
                             align = "left",
                             style,
                             ...props
                         }: BaseTextProps) {

    const resolvedColor =
        color in colors
            ? colors[color as keyof typeof colors]
            : color;

    return (
        <Text
            {...props}
            style={[
                {
                    color: resolvedColor,
                    fontSize: typography.body.fontSize,
                    lineHeight: typography.body.lineHeight,
                    fontWeight: fontWeights[weight],
                    textAlign: align,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}