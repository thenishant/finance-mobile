import React from "react";
import {StyleProp, TextStyle} from "react-native";

import {BaseText, BaseTextProps} from "./BaseText";
import {typography} from "../../design";
import {formatCurrency} from "../../utils/formatCurrency";

export interface AmountTextProps
    extends Omit<BaseTextProps, "children"> {

    value: number;

    currency?: string;

    abbreviated?: boolean;

    showSign?: boolean;

    style?: StyleProp<TextStyle>;
}

export function AmountText({
                               value,
                               currency = "INR",
                               abbreviated = false,
                               showSign = false,
                               weight = "bold",
                               style,
                               ...props
                           }: AmountTextProps) {

    return (
        <BaseText
            {...props}
            weight={weight}
            style={[
                {
                    fontSize: typography.title.fontSize,
                    lineHeight: typography.title.lineHeight,
                    fontVariant: ["tabular-nums"],
                },
                style,
            ]}
        >
            {formatCurrency(value, {
                currency,
                compact: abbreviated,
                showSign,
            })}
        </BaseText>
    );
}