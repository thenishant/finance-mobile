import React from "react";
import {StyleSheet} from "react-native";
import {AppText, Card, Stack} from "../../../../components/common";
import {colors, spacing} from "../../../../design";

export default function ReviewCategorySection() {
    return (
        <Card padding={spacing.lg} style={styles.card}>
            <Stack spacing="xs">
                <AppText
                    variant="body"
                    weight="700"
                    color={colors.warning}
                >
                    ⚠ Review Suggested Category
                </AppText>

                <AppText
                    variant="body"
                    color={colors.textSecondary}
                >
                    We weren't completely confident about the
                    AI-selected category. Please review it and edit
                    the transaction if needed.
                </AppText>
            </Stack>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2A220F",
        borderWidth: 1,
        borderColor: "#5B4610",
    },
});