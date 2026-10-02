import React from "react";
import {ActivityIndicator, Pressable, StyleSheet, View,} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {formatDistanceToNow} from "date-fns";

import SectionCard from "../common/SectionCard";
import ListRow from "../common/ListRow";
import {Button} from "../Button";

import {Body, Caption,} from "../typography";

import {colors, spacing,} from "../../design";

import {GmailStatus} from "../../services/gmail.service";

interface Props {
    status?: GmailStatus;
    connecting: boolean;
    enablingAutoImport: boolean;
    onConnect: () => void;
    onEnableAutoImport: () => void;
}

export const GmailConnectionCard = ({
                                        status,
                                        connecting,
                                        enablingAutoImport,
                                        onConnect,
                                        onEnableAutoImport,
                                    }: Props) => {
    if (!status?.connected) {
        return (
            <SectionCard title="Gmail">
                <View style={styles.emptyRow}>
                    <View style={styles.icon}>
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            color={colors.primary}
                        />
                    </View>

                    <View style={styles.emptyText}>
                        <Body weight="medium">
                            Not connected
                        </Body>

                        <Caption
                            color="textSecondary"
                            style={styles.subtitle}
                        >
                            Connect Gmail to import bank
                            transaction emails automatically.
                        </Caption>
                    </View>
                </View>

                <Button
                    title="Connect Gmail"
                    loading={connecting}
                    disabled={connecting}
                    onPress={onConnect}
                    fullWidth
                    style={styles.connectButton}
                />
            </SectionCard>
        );
    }

    const autoImportActive =
        status.watchActive &&
        status.watchStatus === "ACTIVE";

    const lastSynced = status.lastSyncAt
        ? formatDistanceToNow(
            new Date(status.lastSyncAt),
            {
                addSuffix: true,
            },
        )
        : "Never";

    return (
        <SectionCard title="Gmail">
            <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                    <View style={styles.icon}>
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            color={colors.primary}
                        />
                    </View>

                    <View style={styles.statusText}>
                        <Body
                            weight="semibold"
                            numberOfLines={1}
                        >
                            {status.email ?? "Gmail"}
                        </Body>

                        <Caption color="textSecondary">
                            Connected
                        </Caption>
                    </View>
                </View>

                <View style={styles.badge}>
                    <View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: autoImportActive
                                    ? colors.success
                                    : colors.warning,
                            },
                        ]}
                    />

                    <Caption
                        color={
                            autoImportActive
                                ? "success"
                                : "warning"
                        }
                        weight="medium"
                    >
                        {autoImportActive
                            ? "Active"
                            : "Attention"}
                    </Caption>
                </View>
            </View>

            <View style={styles.divider}/>

            <ListRow
                left={
                    <View style={styles.icon}>
                        <Ionicons
                            name="flash-outline"
                            size={18}
                            color={colors.primary}
                        />
                    </View>
                }
                title={
                    <Body weight="medium">
                        Auto import
                    </Body>
                }
                subtitle={
                    <Caption color="textSecondary">
                        {autoImportActive
                            ? "New transaction emails import in the background"
                            : "Background import is not running"}
                    </Caption>
                }
                trailing={
                    autoImportActive ? (
                        <Caption
                            color="success"
                            weight="medium"
                        >
                            On
                        </Caption>
                    ) : enablingAutoImport ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />
                    ) : (
                        <Pressable
                            onPress={onEnableAutoImport}
                            hitSlop={10}
                            style={({pressed}) =>
                                pressed && styles.pressed
                            }
                        >
                            <Caption
                                color="primary"
                                weight="medium"
                            >
                                {status.watchStatus === "EXPIRED"
                                    ? "Renew"
                                    : "Enable"}
                            </Caption>
                        </Pressable>
                    )
                }
            />

            <View style={styles.rowDivider}>
                <ListRow
                    left={
                        <View style={styles.icon}>
                            <Ionicons
                                name="time-outline"
                                size={18}
                                color={colors.primary}
                            />
                        </View>
                    }
                    title={
                        <Body weight="medium">
                            Last import
                        </Body>
                    }
                    subtitle={
                        <Caption color="textSecondary">
                            Most recent Gmail sync
                        </Caption>
                    }
                    trailing={
                        <Caption weight="medium">
                            {lastSynced}
                        </Caption>
                    }
                />
            </View>
        </SectionCard>
    );
};

const styles = StyleSheet.create({
    emptyRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: spacing.sm,
    },

    emptyText: {
        flex: 1,
        marginLeft: spacing.sm,
    },

    subtitle: {
        marginTop: 2,
        lineHeight: 18,
    },

    connectButton: {
        marginTop: spacing.lg,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.sm,
    },

    statusLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    statusText: {
        flex: 1,
        marginLeft: spacing.sm,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: spacing.sm,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: spacing.xs,
    },

    icon: {
        width: 36,
        height: 36,
        borderRadius: spacing.sm,
        backgroundColor: colors.overlayMedium,
        alignItems: "center",
        justifyContent: "center",
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginTop: spacing.sm,
    },

    rowDivider: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },

    pressed: {
        opacity: 0.6,
    },
});
