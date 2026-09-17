import React from "react";
import {StyleProp, View, ViewStyle,} from "react-native";

import {colors, spacing} from "../../design";

export interface DividerProps {
    inset?: keyof typeof spacing;
    vertical?: boolean;
    thickness?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({
                                                    inset,
                                                    vertical = false,
                                                    thickness = 1,
                                                    color = colors.border,
                                                    style,
                                                }) => {

    if (vertical) {

        return (
            <View
                style={[{
                    width: thickness,
                    alignSelf: "stretch",
                    backgroundColor: color,
                    marginHorizontal: inset ? spacing[inset] : 0,
                },
                    style,
                ]}
            />
        );
    }

    return (
        <View
            style={[
                {
                    height: thickness,
                    backgroundColor: color,
                    marginHorizontal: inset ? spacing[inset] : 0,
                },
                style
            ]}
        />
    );

};