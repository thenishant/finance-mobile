import React from "react";
import {View} from "react-native";

import {spacing} from "../../design";

export type SpacerSize =
    keyof typeof spacing;

interface SpacerProps {
    size?: SpacerSize;
    horizontal?: boolean;
    flex?: number;
}

export const Spacer: React.FC<SpacerProps> = ({
                                                  size = "md",
                                                  horizontal = false,
                                                  flex,
                                              }) => {

    if (flex !== undefined) {
        return <View style={{flex}}/>;
    }

    return (
        <View
            pointerEvents="none"
            style={
                horizontal ? {
                    width: spacing[size],
                } : {
                    height: spacing[size],
                }
            }
        />
    );
};