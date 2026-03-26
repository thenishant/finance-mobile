import React, {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";

import Animated, {FadeIn, FadeOut, Layout, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Image} from "expo-image";
import {getBankLogo} from "../../utils/bankMapper";

interface Account {
    id: string;
    name: string;
    balance: number;
}

interface Props {
    accounts?: Account[];
}

export const AccountsCard = ({accounts = []}: Props) => {

    const [hidden, setHidden] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const rotate = useSharedValue(0);

    if (!accounts.length) return null;

    const total = accounts.reduce(
        (sum, acc) => sum + acc.balance,
        0
    );

    const format = (value: number) =>
        hidden ? "••••" : `₹${value.toLocaleString()}`;

    const toggleExpand = () => {
        const next = !expanded;
        setExpanded(next);

        rotate.value = withTiming(next ? 180 : 0, {
            duration: 250
        });
    };

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${rotate.value}deg`}],
    }));

    return (
        <View style={styles.container}>

            {/* 🔥 HERO */}
            <Pressable onPress={toggleExpand}>
                <LinearGradient
                    colors={["#111827", "#1F2937"]}
                    style={styles.hero}
                >

                    <View style={styles.heroHeader}>

                        <View style={styles.leftHeader}>

                            <Text style={styles.heroLabel}>
                                Total Balance
                            </Text>

                            {/* 🔥 CHEVRON */}
                            <Animated.View style={[styles.chevron, iconStyle]}>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    color="#9CA3AF"
                                />
                            </Animated.View>

                        </View>

                        {/* 👁 HIDE/SHOW */}
                        <Pressable onPress={() => setHidden(!hidden)}>
                            <Ionicons
                                name={hidden ? "eye-off" : "eye"}
                                size={18}
                                color="#9CA3AF"
                            />
                        </Pressable>

                    </View>

                    <Text style={styles.heroAmount}>
                        {format(total)}
                    </Text>

                </LinearGradient>
            </Pressable>

            {/* 🔥 EXPANDABLE LIST (NO HEIGHT BUGS) */}
            {expanded && (
                <Animated.View
                    layout={Layout.springify().damping(18)}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.list}
                >

                    {accounts.map(acc => (
                        <View key={acc.id} style={styles.row}>

                            <View style={styles.left}>

                                <Image
                                    source={getBankLogo(acc.name)}
                                    style={styles.logo}
                                    contentFit="contain"
                                />

                                <Text style={styles.name}>
                                    {acc.name}
                                </Text>

                            </View>

                            <Text style={styles.value}>
                                {format(acc.balance)}
                            </Text>

                        </View>
                    ))}

                </Animated.View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        marginTop: 16
    },

    /* HERO */

    hero: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        marginBottom: 10
    },
    heroHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    chevron: {
        marginLeft: 6
    },
    heroLabel: {
        color: "#9CA3AF",
        fontSize: 13
    },
    heroAmount: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
        marginTop: 6
    },

    /* LIST */
    list: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        borderRadius: 16,
        paddingHorizontal: 16
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6"
    },
    name: {
        fontSize: 14,
        color: "#374151"
    },
    value: {
        fontSize: 14,
        fontWeight: "600"
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 26,
        height: 26,
        marginRight: 10,
    },

});