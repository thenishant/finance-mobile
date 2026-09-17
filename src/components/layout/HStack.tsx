import React from "react";
import {View,} from "react-native";

import {spacing} from "../../design";
import {StackProps} from "./types";

export const HStack: React.FC<StackProps> = ({
                                                 children,
                                                 spacing: gap,
                                                 align = "center",
                                                 justify = "flex-start",
                                                 wrap = false,
                                                 flex,
                                                 fill = false,
                                                 style,
                                                 ...props
                                             }) => {

    const items =
        React.Children.toArray(children);

    return (
        <View
            {...props}
            style={[
                {
                    flexDirection: "row",
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap
                        ? "wrap"
                        : "nowrap",
                    width: fill
                        ? "100%"
                        : undefined,
                    flex,
                },
                style,
            ]}
        >
            {items.map((child, index) => (
                <View
                    key={index}
                    style={{
                        marginRight:
                            gap &&
                            index < items.length - 1
                                ? spacing[gap]
                                : 0,
                    }}
                >
                    {child}
                </View>
            ))}
        </View>
    );

};