import React, {useState} from "react";
import {LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {DashboardAccount, DashboardSummary} from "../../../types/dashboard";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
    totalBalance: number;
    accounts: DashboardAccount[];
    onAccountPress?: (account: DashboardAccount) => void;
};

export const TotalBalanceHero = ({totalBalance, accounts, onAccountPress,}: Props) => {
    const [hidden, setHidden] = useState(false);
    const [expanded, setExpanded] = useState(false);

    if (!accounts.length) return null;

    const format = (value: number) =>
        hidden ? "••••" : `₹${value.toLocaleString()}`;

    const toggle = () => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={toggle}>
                <View style={styles.header}>
                    <Text style={styles.label}>Net Worth</Text>

                    <View style={styles.actions}>
                        <Pressable onPress={() => setHidden(!hidden)}>
                            <Ionicons
                                name={hidden ? "eye-off" : "eye"}
                                size={18}
                                color="#CBD5E1"
                            />
                        </Pressable>

                        <Ionicons
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#CBD5E1"
                        />
                    </View>
                </View>

                <Text style={styles.amount}>
                    {format(totalBalance)}
                </Text>
            </Pressable>

            {expanded && (
                <View style={styles.list}>
                    {accounts.map((account, index) => (
                        <View key={account.id}>
                            <Pressable
                                style={styles.item}
                                onPress={() => onAccountPress?.(account)}
                            >
                                <View>
                                    <Text style={styles.name}>
                                        {account.name}
                                    </Text>

                                    <Text style={styles.last4}>
                                        {account.last4 ? `•••• ${account.last4}` : account.type}
                                    </Text>
                                </View>

                                <Text style={styles.value}>
                                    {format(Number(account.balance))}
                                </Text>

                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color="#9CA3AF"
                                />
                            </Pressable>

                            {index < accounts.length - 1 && (
                                <View style={styles.divider}/>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        marginTop: 12,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    label: {
        color: "#94A3B8",
        fontSize: 13,
    },

    amount: {
        color: "#fff",
        fontSize: 42,
        fontWeight: "600",
        marginTop: 8,
        letterSpacing: -1,
    },

    list: {
        backgroundColor: "#fff",
        marginTop: 12,
        borderRadius: 20,
        padding: 16,
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },

    name: {
        color: "#374151",
    },

    value: {
        fontWeight: "600",
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    last4: {
        marginTop: 4,
        fontSize: 12,
        color: "#9CA3AF",
    },

    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
    },
});