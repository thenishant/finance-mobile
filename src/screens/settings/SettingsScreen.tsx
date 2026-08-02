import React from "react";
import {ActivityIndicator, Alert, StyleSheet, Switch, Text, TouchableOpacity, View,} from "react-native";
import {useQueryClient} from "@tanstack/react-query";

import {Screen} from "../../components/common/ui/Screen";
import {PillGroup} from "../../components/common/ui";
import {colors, spacing} from "../../design";
import {useAuth} from "../../hooks/useAuth";
import {useGmail, useGmailStatus, useSyncGmail,} from "../../hooks/gmail/useGmail";
import {gmailService} from "../../services/gmail.service";

const SYNC_OPTIONS = [
    {value: "10", label: "10"},
    {value: "25", label: "25"},
    {value: "50", label: "50"},
    {value: "100", label: "100"},
] as const;

const SettingsScreen = () => {
    const {logout} = useAuth();
    const queryClient = useQueryClient();

    const [maxResults, setMaxResults] =
        React.useState<
            (typeof SYNC_OPTIONS)[number]["value"]
        >("10");

    const {
        data: gmail,
        isLoading,
    } = useGmailStatus();

    const {
        mutate: connectGmail,
        isPending: isConnecting,
    } = useGmail();

    const {
        mutate: syncGmail,
        isPending: syncing,
    } = useSyncGmail();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout,
                },
            ]
        );
    };

    const handleConnect = () => {
        connectGmail(undefined, {
            onSuccess: () => {
                Alert.alert(
                    "Success",
                    "Your Gmail account has been connected."
                );
            },
            onError: error => {
                if (
                    error instanceof Error &&
                    error.message !==
                    "Google connection cancelled."
                ) {
                    Alert.alert(
                        "Connection Failed",
                        error.message
                    );
                }
            },
        });
    };

    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect Gmail",
            "Previously imported transactions will remain. New emails won't be imported anymore.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Disconnect",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await gmailService.disconnect();

                            await queryClient.invalidateQueries({
                                queryKey: ["gmail"],
                            });
                        } catch {
                            Alert.alert(
                                "Error",
                                "Unable to disconnect Gmail."
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleSync = () => {
        syncGmail(Number(maxResults), {
            onSuccess: result => {
                Alert.alert(
                    "Sync Complete",
                    [
                        `Fetched: ${result.fetched}`,
                        `Transactions: ${result.transactionsCreated}`,
                        `Duplicates: ${result.duplicates}`,
                    ].join("\n")
                );

                queryClient.invalidateQueries({
                    queryKey: ["gmail"],
                });
            },
            onError: error => {
                Alert.alert(
                    "Sync Failed",
                    error instanceof Error
                        ? error.message
                        : "Unable to sync Gmail."
                );
            },
        });
    };

    const lastSynced = gmail?.lastSyncAt
        ? new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
        }).format(new Date(gmail.lastSyncAt))
        : null;

    return (
        <Screen scroll style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.card}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary}/>) : (
                    <>
                        <View style={styles.header}>
                            <View style={styles.info}>
                                <Text style={styles.cardTitle}>Automatic Gmail Import</Text>

                                <Text style={styles.description}>
                                    Import bank transaction emails automatically.
                                </Text>
                            </View>

                            <Switch
                                disabled={isConnecting}
                                value={gmail?.connected ?? false}
                                onValueChange={enabled => enabled ? handleConnect() : handleDisconnect()}
                            />
                        </View>

                        {gmail?.connected && (
                            <>
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.label}>Emails to sync</Text>
                                        {lastSynced && (
                                            <Text style={styles.lastSync}>Last synced {lastSynced}</Text>
                                        )}
                                    </View>

                                    <PillGroup
                                        data={SYNC_OPTIONS}
                                        value={maxResults}
                                        onChange={setMaxResults}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.syncButton, syncing && styles.disabled,]}
                                    disabled={syncing}
                                    onPress={handleSync}>
                                    <Text style={styles.syncText}>
                                        {syncing ? "Syncing..." : "Sync Now"}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}>
                <Text style={styles.logoutText}>
                    Logout
                </Text>
            </TouchableOpacity>
        </Screen>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: spacing.md,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: spacing.lg,
        color: colors.text,
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 5,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    info: {
        flex: 1,
        paddingRight: spacing.md,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    description: {
        marginTop: 6,
        fontSize: 15,
        lineHeight: 22,
        color: colors.grey,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },

    statusTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.text,
    },

    email: {
        marginTop: 8,
        fontSize: 15,
        color: colors.text,
    },

    section: {
        marginTop: spacing.xl,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },

    lastSync: {
        fontSize: 13,
        color: colors.grey,
    },

    syncButton: {
        marginTop: spacing.xl,
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
    },

    syncText: {
        color: colors.white,
        fontSize: 17,
        fontWeight: "700",
    },

    disabled: {
        opacity: 0.6,
    },

    logoutButton: {
        marginTop: spacing.xl,
        borderWidth: 1,
        borderColor: colors.red,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        backgroundColor: colors.white,
    },

    logoutText: {
        color: colors.red,
        fontSize: 16,
        fontWeight: "600",
    },
});