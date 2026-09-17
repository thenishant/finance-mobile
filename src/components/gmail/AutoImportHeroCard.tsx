import React from "react";
import {StyleSheet, View} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {formatDistanceToNow} from "date-fns";

import SectionCard from "../common/SectionCard";
import ListRow from "../common/ListRow";
import AppIcon from "../common/AppIcon";

import {
    Body,
    Caption,
} from "../typography";

import {
    colors,
    spacing,
} from "../../design";

import {GmailStatus} from "../../services/gmail.service";

interface Props {
    status: GmailStatus;
}

export const AutoImportHeroCard = ({
                                       status,
                                   }: Props) => {
    const lastImport = status.lastSyncAt
        ? formatDistanceToNow(
            new Date(status.lastSyncAt),
            {
                addSuffix: true,
            },
        )
        : "Never";

    const healthy =
        status.watchActive &&
        status.watchStatus === "ACTIVE";

    return (
        <SectionCard title="Auto Import">
            {/* Connection status */}
            <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                    <AppIcon type="mail" />

                    <View style={styles.statusText}>
                        <Body weight="semibold">
                            Gmail
                        </Body>

                        <Caption color="textSecondary">
                            {status.email}
                        </Caption>
                    </View>
                </View>

                <View style={styles.statusBadge}>
                    <View
                        style={[
                            styles.statusDot,
                            {
                                backgroundColor:
                                    healthy
                                        ? colors.success
                                        : colors.warning,
                            },
                        ]}
                    />

                    <Caption
                        color={
                            healthy
                                ? "success"
                                : "warning"
                        }
                        weight="medium"
                    >
                        {healthy
                            ? "Active"
                            : "Attention"}
                    </Caption>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Import information */}
            <ListRow
                left={
                    <AppIcon type="time" />
                }
                title={
                    <Body weight="medium">
                        Last import
                    </Body>
                }
                subtitle={
                    <Caption color="textSecondary">
                        Latest Gmail sync
                    </Caption>
                }
                trailing={
                    <Caption weight="medium">
                        {lastImport}
                    </Caption>
                }
            />

            <View style={styles.row}>
                <ListRow
                    left={
                        <AppIcon
                            type={healthy ? "checkmark" : "alert"}
                            size={20}
                        />
                    }
                    title={
                        <Body weight="medium">
                            Sync status
                        </Body>
                    }
                    subtitle={
                        <Caption color="textSecondary">
                            Background transaction import
                        </Caption>
                    }
                    trailing={
                        <Caption
                            color={
                                healthy
                                    ? "success"
                                    : "warning"
                            }
                            weight="medium"
                        >
                            {healthy
                                ? "Healthy"
                                : "Needs attention"}
                        </Caption>
                    }
                />
            </View>
        </SectionCard>
    );
};

const styles = StyleSheet.create({
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: spacing.xs,
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginVertical: spacing.sm,
    },

    row: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
});