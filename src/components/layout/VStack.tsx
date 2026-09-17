import React from "react";
import {View,} from "react-native";

import {spacing} from "../../design";
import {StackProps} from "./types";

export const VStack: React.FC<StackProps> = ({
                                                 children,
                                                 spacing: gap,
                                                 align = "stretch",
                                                 justify = "flex-start",
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
                    flexDirection: "column",
                    alignItems: align,
                    justifyContent: justify,
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
                        marginBottom:
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