import React from "react";
import {Alert, Pressable, RefreshControl, ScrollView, StyleSheet,} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

import {AppScreen, ScreenHeader,} from "../../ui";

import {Spacer} from "../../components";

import {AccountDetailsCard, GmailConnectionCard, SessionCard,} from "../../components/settings";

import {GmailActionCard} from "../../components/gmail/GmailActionCard";

import {useProfile} from "../../hooks/useProfile";
import {useAuth} from "../../hooks/useAuth";

import {useDisconnectGmail, useGmail, useGmailStatus, useStartWatch, useSyncGmail,} from "../../hooks/gmail/useGmail";

import {colors, spacing} from "../../design";

export const AccountSettingsScreen = () => {
    const navigation = useNavigation();

    const {logout} = useAuth();

    const profile = useProfile();
    const gmail = useGmailStatus();

    const connect = useGmail();
    const disconnect = useDisconnectGmail();
    const sync = useSyncGmail();
    const startWatch = useStartWatch();

    /**
     * Driven by pull-to-refresh only. Binding this to
     * isRefetching would pop the spinner open on every
     * background refetch (e.g. after a sync invalidates
     * the Gmail query) and jolt the scroll view.
     */
    const [refreshing, setRefreshing] =
        React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await Promise.all([
                profile.refetch(),
                gmail.refetch(),
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    const handleConnect = () => {
        connect.mutate(undefined, {
            onError: error => {
                if (
                    error instanceof Error &&
                    error.message ===
                    "Google connection cancelled."
                ) {
                    return;
                }

                Alert.alert(
                    "Connection Failed",
                    error instanceof Error
                        ? error.message
                        : "Unable to connect Gmail.",
                );
            },
        });
    };

    const handleEnableAutoImport = () => {
        startWatch.mutate(undefined, {
            onError: () => {
                Alert.alert(
                    "Auto Import Failed",
                    "Unable to enable background import. Please try again.",
                );
            },
        });
    };

    const handleSync = () => {
        sync.mutate(undefined, {
            onSuccess: result => {
                Alert.alert(
                    "Sync Complete",
                    [
                        `Fetched: ${result.fetched}`,
                        `Transactions: ${result.transactionsCreated}`,
                        `Duplicates: ${result.duplicates}`,
                    ].join("\n"),
                );
            },
            onError: error => {
                Alert.alert(
                    "Sync Failed",
                    error instanceof Error
                        ? error.message
                        : "Unable to sync Gmail.",
                );
            },
        });
    };

    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect Gmail?",
            "Previously imported transactions stay. New emails won't be imported anymore.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Disconnect",
                    style: "destructive",
                    onPress: () => disconnect.mutate(),
                },
            ],
        );
    };

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
            ],
        );
    };

    return (
        <AppScreen keyboard={false}>
            <ScreenHeader
                title="Account Settings"
                subtitle="Manage your account and connected services"
                left={
                    <Pressable
                        onPress={() => navigation.goBack()}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        style={({pressed}) => [
                            styles.back,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={colors.text}
                        />
                    </Pressable>
                }
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <AccountDetailsCard
                    profile={profile.data}
                    loading={profile.isLoading}
                    error={profile.isError}
                />

                <Spacer size="md"/>

                <GmailConnectionCard
                    status={gmail.data}
                    connecting={connect.isPending}
                    enablingAutoImport={startWatch.isPending}
                    onConnect={handleConnect}
                    onEnableAutoImport={handleEnableAutoImport}
                />

                {gmail.data?.connected && (
                    <>
                        <Spacer size="md"/>

                        <GmailActionCard
                            syncing={sync.isPending}
                            onSync={handleSync}
                            onDisconnect={handleDisconnect}
                        />
                    </>
                )}

                <Spacer size="md"/>

                <SessionCard
                    onLogout={handleLogout}
                />

                <Spacer size="lg"/>
            </ScrollView>
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    back: {
        width: 36,
        height: 36,
        borderRadius: spacing.sm,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    pressed: {
        opacity: 0.65,
    },
});

export default AccountSettingsScreen;
