import React from "react";
import {StyleSheet, View} from "react-native";

import {Body} from "../../typography";
import {colors, radius, spacing} from "../../../design";
import {useToastStore} from "../../../stores/useToastStore";

export const Toast = () => {

    const {message} = useToastStore();

    if (!message) return null;

    return (
        <View
            style={styles.container}
            pointerEvents="none"
        >
            <Body
                weight="semibold"
                align="center"
            >
                {message}
            </Body>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        bottom: 96,
        left: spacing.lg,
        right: spacing.lg,
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: colors.surfaceElevated,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.round,
    },

});
