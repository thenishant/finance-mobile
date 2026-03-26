import React, {useEffect, useState} from "react";
import {FlatList, Pressable, StyleSheet, Text, View,} from "react-native";
import Animated, {FadeIn, FadeOut, Layout,} from "react-native-reanimated";

import {Screen} from "../../components/ui/Screen";
import {Button} from "../../components/ui";
import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useCategories} from "../../hooks/useCategories";
import {Ionicons} from "@expo/vector-icons";
import {useRecentCategories} from "../../stores/useRecentCategories";
import {getCategoryMeta} from "../../design/categoryMeta";

export const SelectCategoryScreen = () => {

    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const draft = useTransactionDraft();

    const {recent, add, hydrate} = useRecentCategories();
    const {data: tree = []} = useCategories();

    const {type} = route.params;

    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        hydrate();
    }, []);

    const filtered = tree
        .map(parent => ({
            ...parent,
            children: parent.children.filter(c => c.type === type),
        }))
        .filter(parent => parent.children.length > 0);

    /* 🔥 SORT BY USAGE */
    const usageMap = new Map(recent.map(r => [r.parentId, r.count]));

    const sorted = [...filtered].sort((a, b) =>
        (usageMap.get(b.id) || 0) - (usageMap.get(a.id) || 0)
    );

    /* 🔥 AUTO EXPAND */
    useEffect(() => {
        if (!expanded && sorted.length) {
            const mostUsed = sorted[0];
            setExpanded(mostUsed.id);
        }
    }, [sorted]);

    const toggle = (id: string) => {
        setExpanded(prev => (prev === id ? null : id));
    };

    const handleSelect = (child: any, parent: any) => {

        const selected = {
            id: child.id,
            name: child.name,
            type: child.type,
            parentId: parent.id,
        };

        draft.setSelectedCategory(selected);
        add(selected);

        navigation.goBack();
    };

    const parentMap = new Map(tree.map(p => [p.id, p.name]));

    return (
        <Screen>

            <FlatList
                data={sorted}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.container}

                ListHeaderComponent={
                    recent.length > 0 ? (
                        <View style={styles.recentSection}>
                            <Text style={styles.recentTitle}>
                                Recents
                            </Text>

                            <FlatList
                                data={recent}
                                horizontal
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{gap: 8}}
                                renderItem={({item}) => {

                                    const parentName =
                                        item.parentId && parentMap.get(item.parentId);

                                    return (
                                        <Pressable
                                            style={styles.chip}
                                            onPress={() => {
                                                draft.setSelectedCategory(item);
                                                navigation.goBack();
                                            }}
                                        >
                                            <Text style={styles.chipText}>
                                                {parentName
                                                    ? `${parentName} / ${item.name}`
                                                    : item.name}
                                            </Text>
                                        </Pressable>
                                    );
                                }}
                            />
                        </View>
                    ) : null
                }

                renderItem={({item}) => {

                    const meta = getCategoryMeta(item.name);
                    const isOpen = expanded === item.id;

                    return (
                        <Animated.View
                            layout={Layout.springify()}
                            style={styles.section}
                        >

                            <Pressable
                                style={styles.parentRow}
                                onPress={() => toggle(item.id)}
                            >
                                <View style={styles.left}>
                                    <View
                                        style={[
                                            styles.iconWrap,
                                            {backgroundColor: meta.color + "20"},
                                        ]}
                                    >
                                        <Ionicons
                                            name={meta.icon as any}
                                            size={16}
                                            color={meta.color}
                                        />
                                    </View>

                                    <Text style={styles.parentText}>
                                        {item.name}
                                    </Text>
                                </View>

                                <Ionicons
                                    name={isOpen ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#9CA3AF"
                                />
                            </Pressable>

                            {isOpen && (
                                <Animated.View
                                    entering={FadeIn}
                                    exiting={FadeOut}
                                >
                                    {item.children.map(child => (
                                        <Button
                                            key={child.id}
                                            title={child.name}
                                            variant="ghost"
                                            onPress={() =>
                                                handleSelect(child, item)
                                            }
                                        />
                                    ))}
                                </Animated.View>
                            )}

                        </Animated.View>
                    );
                }}

            />

        </Screen>
    );
};

const styles = StyleSheet.create({

    container: {
        paddingBottom: 24,
    },

    section: {
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    parentRow: {
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    parentText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    iconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    /* 🔥 RECENT */

    recentSection: {
        marginHorizontal: 16,
        marginBottom: 12,
    },

    recentTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 6,
    },

    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
    },

    chipText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#111827",
    },

});