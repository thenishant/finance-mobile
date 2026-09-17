import React from "react";
import {ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, View,} from "react-native";

import {AppScreen, ScreenHeader,} from "../../ui";

import {Body,} from "../../components/typography";

import {Spacer,} from "../../components";

import {
    useDisconnectGmail,
    useGmail,
    useGmailStatus,
    useRecentImports,
    useSyncGmail,
} from "../../hooks/gmail/useGmail";

import {GmailEmptyState} from "../../components/gmail/GmailEmptyState";
import {AutoImportHeroCard} from "../../components/gmail/AutoImportHeroCard";
import {GmailActionCard} from "../../components/gmail/GmailActionCard";

export const GmailScreen = () => {
    const {
        data,
        isLoading,
        isRefetching,
        refetch,
    } = useGmailStatus();

    const connect = useGmail();
    const disconnect = useDisconnectGmail();
    const sync = useSyncGmail();
    const recentImports = useRecentImports();

    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect Gmail?",
            "Automatic transaction import will stop. You can reconnect at any time.",
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

    const onRefresh = async () => {
        await Promise.all([
            refetch(),
            recentImports.refetch(),
        ]);
    };

    if (isLoading) {
        return (
            <AppScreen>
                <ScreenHeader title="Gmail"/>

                <View style={styles.center}>
                    <ActivityIndicator/>

                    <Spacer size="sm"/>

                    <Body color="muted">
                        Checking Gmail connection...
                    </Body>
                </View>
            </AppScreen>
        );
    }

    if (!data?.connected) {
        return (
            <AppScreen>
                <ScreenHeader title="Gmail"/>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Spacer size="xs"/>

                    <GmailEmptyState
                        loading={connect.isPending}
                        onConnect={() => connect.mutate()}
                    />

                    <Spacer size="lg"/>
                </ScrollView>
            </AppScreen>
        );
    }

    return (
        <AppScreen>
            <ScreenHeader title="Gmail"/>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            isRefetching ||
                            recentImports.isRefetching
                        }
                        onRefresh={onRefresh}
                    />
                }
            >
                <Spacer size="xs"/>

                <AutoImportHeroCard
                    status={data}
                />

                <Spacer size="md"/>

                <GmailActionCard
                    syncing={sync.isPending}
                    onSync={() => sync.mutate()}
                    onDisconnect={handleDisconnect}
                />

                <Spacer size="lg"/>
            </ScrollView>
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});