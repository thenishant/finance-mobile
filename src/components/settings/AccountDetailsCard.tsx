import React from "react";
import {ActivityIndicator, StyleSheet, View,} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {format} from "date-fns";

import SectionCard from "../common/SectionCard";
import ListRow from "../common/ListRow";

import {Body, Caption,} from "../typography";

import {colors, radius, spacing,} from "../../design";

import {UserProfile} from "../../types/user.types";

interface Props {
    profile?: UserProfile;
    loading?: boolean;
    error?: boolean;
}

const PROVIDER_LABEL: Record<
    UserProfile["authProvider"],
    string
> = {
    EMAIL: "Email & password",
    GOOGLE: "Google",
};

export const AccountDetailsCard = ({
                                       profile,
                                       loading = false,
                                       error = false,
                                   }: Props) => {
    if (loading) {
        return (
            <SectionCard title="Account">
                <View style={styles.center}>
                    <ActivityIndicator
                        color={colors.primary}
                    />
                </View>
            </SectionCard>
        );
    }

    if (error || !profile) {
        return (
            <SectionCard title="Account">
                <View style={styles.center}>
                    <Caption color="textSecondary">
                        Unable to load your account details.
                    </Caption>
                </View>
            </SectionCard>
        );
    }

    const initial = profile.email.charAt(0).toUpperCase();
    const memberSince = format(new Date(profile.createdAt), "MMMM yyyy",);

    return (
        <SectionCard title="Account">
            <View style={styles.identity}>
                <View style={styles.avatar}>
                    <Body
                        weight="semibold"
                        style={styles.avatarText}
                    >
                        {initial}
                    </Body>
                </View>

                <View style={styles.identityText}>
                    <Body
                        weight="semibold"
                        numberOfLines={1}
                    >
                        {profile.email}
                    </Body>

                    <Caption color="textSecondary">
                        Member since {memberSince}
                    </Caption>
                </View>
            </View>

            <View style={styles.divider}/>

            <ListRow
                left={
                    <View style={styles.icon}>
                        <Ionicons
                            name={
                                profile.authProvider === "GOOGLE"
                                    ? "logo-google"
                                    : "mail-outline"
                            }
                            size={18}
                            color={colors.primary}
                        />
                    </View>
                }
                title={
                    <Body weight="medium">
                        Sign-in method
                    </Body>
                }
                subtitle={
                    <Caption color="textSecondary">
                        How you access this account
                    </Caption>
                }
                trailing={
                    <Caption weight="medium">
                        {PROVIDER_LABEL[profile.authProvider]}
                    </Caption>
                }
            />
        </SectionCard>
    );
};

const styles = StyleSheet.create({
    center: {
        paddingVertical: spacing.lg,
        alignItems: "center",
    },

    identity: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.sm,
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: radius.round,
        backgroundColor: `${colors.primary}20`,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: colors.primary,
        fontSize: 20,
    },

    identityText: {
        flex: 1,
        marginLeft: spacing.md,
    },

    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginTop: spacing.md,
    },

    icon: {
        width: 36,
        height: 36,
        borderRadius: spacing.sm,
        backgroundColor: colors.overlayMedium,
        alignItems: "center",
        justifyContent: "center",
    },
});
