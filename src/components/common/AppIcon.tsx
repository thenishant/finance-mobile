import React from "react";
import {StyleSheet, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {financeIcons, FinanceIconType,} from "../../design/icons";
import {iconSizes} from "../../design/iconSizes";
import {spacing} from "../../design";

interface AppIconProps {
    type: FinanceIconType;
    size?: number;
}

export default function AppIcon({
                                    type,
                                    size = iconSizes.lg,
                                }: AppIconProps) {

    const icon = financeIcons[type];

    return (
        <View
            style={[styles.container, {
                backgroundColor: icon.background,
            }]}
        >
            <Ionicons
                name={icon.icon}
                size={size}
                color={icon.color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: iconSizes["2xl"],
        height: iconSizes["2xl"],
        borderRadius: spacing.md,
        justifyContent: "center",
        alignItems: "center",
    },

});