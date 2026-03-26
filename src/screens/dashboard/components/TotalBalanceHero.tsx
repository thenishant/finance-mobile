import React, {useState} from "react";
import {LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export const TotalBalanceHero = ({accounts = []}: any) => {

    const [hidden, setHidden] = useState(false);
    const [expanded, setExpanded] = useState(false);

    if (!accounts.length) return null;

    const total = accounts.reduce(
        (sum: number, acc: any) => sum + Number(acc.balance),
        0
    );

    const format = (v: number) =>
        hidden ? "••••" : `₹${v.toLocaleString()}`;

    const toggle = () => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(prev => !prev);
    };

    return (
        <View style={styles.container}>

            <Pressable onPress={toggle}>

                <View style={styles.header}>
                    <Text style={styles.label}>
                        Total Balance
                    </Text>

                    <Pressable onPress={() => setHidden(!hidden)}>
                        <Ionicons
                            name={hidden ? "eye-off" : "eye"}
                            size={18}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>

                <Text style={styles.amount}>
                    {format(total)}
                </Text>

                <Text style={styles.sub}>
                    Tap to {expanded ? "hide" : "view"} accounts
                </Text>

            </Pressable>

            {expanded && (
                <View style={styles.list}>
                    {accounts.map((acc: any) => (
                        <View key={acc.id} style={styles.item}>
                            <Text style={styles.name}>
                                {acc.name}
                            </Text>
                            <Text style={styles.value}>
                                {format(Number(acc.balance))}
                            </Text>
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
        fontSize: 40,
        fontWeight: "700",
        marginTop: 6,
        letterSpacing: 1,
    },

    sub: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 6,
    },

    list: {
        backgroundColor: "#fff",
        marginTop: 14,
        borderRadius: 20,
        padding: 16,
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
    },

    name: {
        color: "#374151",
    },

    value: {
        fontWeight: "600",
    },
});