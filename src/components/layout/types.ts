import React from "react";
import {StyleProp, ViewProps, ViewStyle,} from "react-native";
import {spacing} from "../../design";

export type StackSpacing =
    keyof typeof spacing;

export interface StackProps
    extends ViewProps {
    children?: React.ReactNode;
    spacing?: StackSpacing;
    align?: ViewStyle["alignItems"];
    justify?: ViewStyle["justifyContent"];
    wrap?: boolean;
    flex?: number;
    fill?: boolean;
    style?: StyleProp<ViewStyle>;
}