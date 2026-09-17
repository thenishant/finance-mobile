import React from "react";

import {BaseText, BaseTextProps,} from "./BaseText";

export function createText(
    fontSize: number,
    lineHeight: number,
    defaultWeight: BaseTextProps["weight"] = "regular",
) {
    return function Typography({
                                   weight = defaultWeight,
                                   style,
                                   ...props
                               }: BaseTextProps) {
        return (
            <BaseText
                {...props}
                weight={weight}
                style={[
                    {
                        fontSize,
                        lineHeight,
                    },
                    style,
                ]}
            />
        );
    };
}