import React from "react";
import {ActivityIndicator, Pressable, StyleSheet, View,} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import SectionCard from "../common/SectionCard";

import {Body, Caption,} from "../typography";

import {colors, spacing,} from "../../design";

interface Props {
    syncing: boolean;
    onSync: () => void;
    onDisconnect: () => void;
}

export const GmailActionCard = ({
                                    syncing,
                                    onSync,
                                    onDisconnect,
                                }: Props) => {
    return (
        <SectionCard title="Gmail Actions">
            <Pressable
                onPress={onSync}
                disabled={syncing}
                style={({pressed}) => [
                    styles.row,
                    pressed && styles.pressed,
                    syncing && styles.disabled,
                ]}
            >
                <View style={styles.icon}>
                    {syncing ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />
                    ) : (
                        <Ionicons
                            name="sync-outline"
                            size={20}
                            color={colors.primary}
                        />
                    )}
                </View>

                <View style={styles.content}>
                    <Body weight="semibold">
                        {syncing
                            ? "Syncing Gmail..."
                            : "Sync Now"}
                    </Body>

                    <Caption
                        color="textSecondary"
                        style={styles.subtitle}
                    >
                        {syncing
                            ? "Checking for new transactions"
                            : "Check for new transactions"}
                    </Caption>
                </View>

                {!syncing && (
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textMuted}
                    />
                )}
            </Pressable>

            <View style={styles.divider}/>

            <Pressable
                onPress={onDisconnect}
                style={({pressed}) => [
                    styles.disconnect,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name="unlink-outline"
                    size={18}
                    color={colors.danger}
                />

                <Body
                    color="danger"
                    weight="medium"
                    style={styles.disconnectText}
                >
                    Disconnect Gmail
                </Body>
            </Pressable>
        </SectionCard>
    );
};

const styles = StyleSheet.create({
    row: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
    },

    icon: {
        width: 36,
        height: 36,
        borderRadius: spacing.sm,
        backgroundColor: colors.overlayMedium,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
        marginLeft: spacing.sm,
    },

    subtitle: {
        marginTop: 2,
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },

    disconnect: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
    },

    disconnectText: {
        marginLeft: spacing.sm,
    },

    pressed: {
        opacity: 0.65,
    },

    disabled: {
        opacity: 0.6,
    },
});