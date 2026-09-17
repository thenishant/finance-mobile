import React from "react";
import {StyleSheet, View} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {Body, Caption, Heading,} from "../typography";

import {colors, spacing,} from "../../design";
import {Button} from "../Button";


interface Props {
    loading?: boolean;
    onConnect: () => void;
}

const FEATURES = [
    "Automatic transaction import",
    "Supports HDFC & Axis Bank",
    "AI merchant categorization",
    "Background sync",
];

export const GmailEmptyState = ({
                                    loading = false,
                                    onConnect,
                                }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Ionicons
                    name="mail-outline"
                    size={30}
                    color={colors.primary}
                />
            </View>

            <Heading style={styles.title}>
                Connect Gmail
            </Heading>

            <Body
                color="muted"
                style={styles.description}
            >
                Automatically import credit card
                transactions without entering them
                manually.
            </Body>

            <View style={styles.features}>
                {FEATURES.map(feature => (
                    <View
                        key={feature}
                        style={styles.feature}
                    >
                        <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={colors.primary}
                        />

                        <Body
                            weight="medium"
                            style={styles.featureText}
                        >
                            {feature}
                        </Body>
                    </View>
                ))}
            </View>

            <Button
                title="Connect Gmail"
                loading={loading}
                disabled={loading}
                onPress={onConnect}
                fullWidth
            />

            <View style={styles.privacy}>
                <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color={colors.textMuted}
                />

                <Caption
                    color="muted"
                    style={styles.privacyText}
                >
                    Your emails stay private. Only
                    transaction alert emails are processed.
                </Caption>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.xl,
    },

    icon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.overlayMedium,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.md,
    },

    title: {
        textAlign: "center",
    },

    description: {
        textAlign: "center",
        marginTop: spacing.xs,
        lineHeight: 21,
    },

    features: {
        width: "100%",
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },

    feature: {
        flexDirection: "row",
        alignItems: "center",
    },

    featureText: {
        marginLeft: spacing.sm,
    },

    privacy: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: spacing.md,
        paddingHorizontal: spacing.sm,
    },

    privacyText: {
        flex: 1,
        marginLeft: spacing.xs,
        lineHeight: 18,
    },
});