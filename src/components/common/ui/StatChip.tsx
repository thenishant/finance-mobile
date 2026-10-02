import React from "react";
import {StyleSheet, View} from "react-native";

import {Body, Caption} from "../../typography";
import {colors, radius, spacing} from "../../../design";

interface Props {
    label: string;
    value: string;
    color?: string;
}

export const StatChip = ({
                             label,
                             value,
                             color = colors.text,
                         }: Props) => {

    return (
        <View style={styles.container}>

            <Caption color="textSecondary">
                {label}
            </Caption>

            <Body
                weight="bold"
                color={color}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={styles.value}
            >
                {value}
            </Body>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.overlayMedium,
        borderRadius: radius.md,
        padding: spacing.md,
    },

    value: {
        marginTop: spacing.xxs,
    },

});
