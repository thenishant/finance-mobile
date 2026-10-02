import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import SectionCard from "../common/SectionCard";

import {Body, Caption,} from "../typography";

import {colors, spacing,} from "../../design";

interface Props {
    onLogout: () => void;
}

export const SessionCard = ({
                                onLogout,
                            }: Props) => {
    return (
        <SectionCard title="Session">
            <Pressable
                onPress={onLogout}
                style={({pressed}) => [
                    styles.row,
                    pressed && styles.pressed,
                ]}
            >
                <View style={styles.icon}>
                    <Ionicons
                        name="log-out-outline"
                        size={18}
                        color={colors.danger}
                    />
                </View>

                <View style={styles.content}>
                    <Body
                        color="danger"
                        weight="semibold"
                    >
                        Logout
                    </Body>

                    <Caption
                        color="textSecondary"
                        style={styles.subtitle}
                    >
                        Sign out on this device
                    </Caption>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                />
            </Pressable>
        </SectionCard>
    );
};

const styles = StyleSheet.create({
    row: {
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.xs,
    },

    icon: {
        width: 36,
        height: 36,
        borderRadius: spacing.sm,
        backgroundColor: `${colors.danger}15`,
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

    pressed: {
        opacity: 0.65,
    },
});
