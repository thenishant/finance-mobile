import React from "react";
import {StyleSheet, View} from "react-native";

import {Body, Caption, Title} from "../../typography";
import {colors, radius, spacing} from "../../../design";
import {formatCurrency} from "../../../utils/currency";

interface Props {
    remaining: number;
}

/**
 * Only render this where a goal actually exists. With no
 * goal, `remaining` is 0 and the card would claim the goal
 * was achieved when there was nothing to achieve.
 */
export const RemainingInvestment = ({remaining}: Props) => {

    const achieved = remaining <= 0;

    const accent = achieved
        ? colors.success
        : colors.warning;

    return (
        <View
            style={[
                styles.card,
                {backgroundColor: `${accent}15`},
            ]}
        >

            <Caption color={accent}>
                Remaining
            </Caption>

            <Title
                weight="bold"
                color={accent}
                style={styles.value}
            >
                {formatCurrency(Math.max(remaining, 0))}
            </Title>

            <Body color={accent} style={styles.hint}>
                {achieved
                    ? "Goal achieved 🎉"
                    : "left to reach goal"}
            </Body>

        </View>
    );
};

const styles = StyleSheet.create({

    card: {
        marginTop: spacing.md,
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: "center",
    },

    value: {
        marginTop: spacing.xxs,
    },

    hint: {
        marginTop: spacing.xxs,
    },

});
