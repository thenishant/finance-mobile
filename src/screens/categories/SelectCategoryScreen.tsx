import React, {useEffect, useState} from "react";
import {FlatList, Modal, Pressable, StyleSheet, Text, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {Screen} from "../../components/ui/Screen";
import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useCategories} from "../../hooks/useCategories";
import {useRecentCategories} from "../../stores/useRecentCategories";
import {getCategoryMeta} from "../../design/categoryMeta";

export const SelectCategoryScreen = () => {

    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const draft = useTransactionDraft();

    const {add, hydrate} = useRecentCategories();
    const {data: tree = []} = useCategories();

    const {type} = route.params;

    const [selectedParent, setSelectedParent] = useState<any>(null);

    useEffect(() => {
        hydrate();
    }, []);

    const filtered = tree.filter(parent =>
        parent.children.some(c => c.type === type)
    );

    const handleSelect = (child: any, parent: any) => {
        const selected = {
            id: child.id,
            name: child.name,
            type: child.type,
            parentId: parent.id,
        };

        draft.setSelectedCategory(selected);
        add(selected);

        setSelectedParent(null);
        navigation.goBack();
    };

    return (
        <Screen>

            {/* GRID */}
            <FlatList
                data={filtered}
                numColumns={4}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.grid}
                renderItem={({item}) => {

                    const meta = getCategoryMeta(item.name);

                    return (
                        <Pressable
                            style={styles.cell}
                            onPress={() => setSelectedParent(item)}
                        >
                            <View
                                style={[
                                    styles.iconWrap,
                                    {backgroundColor: meta.color + "20"}
                                ]}
                            >
                                <Ionicons
                                    name={meta.icon as any}
                                    size={20}
                                    color={meta.color}
                                />
                            </View>

                            <Text style={styles.label}>
                                {item.name}
                            </Text>
                        </Pressable>
                    );
                }}
            />

            {/* FLOATING CREATE BUTTON */}
            <Pressable
                style={styles.fab}
                onPress={() =>
                    navigation.navigate("CreateCategory", {type})
                }
            >
                <Ionicons name="add" size={22} color="#fff"/>
            </Pressable>

            {/* BOTTOM SHEET */}
            <CategorySheet
                parent={selectedParent}
                onClose={() => setSelectedParent(null)}
                onSelect={handleSelect}
                type={type}
            />

        </Screen>
    );
};

/* =============================
   CATEGORY SHEET
============================= */

const CategorySheet = ({parent, onClose, onSelect, type}: any) => {

    if (!parent) return null;

    const children = parent.children.filter((c: any) => c.type === type);

    return (
        <Modal
            visible={!!parent}
            transparent
            animationType="slide"
        >
            <View style={styles.overlay}>

                {/* BACKDROP */}
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                {/* SHEET */}
                <View style={styles.sheet}>

                    <View style={styles.handle}/>

                    <Text style={styles.sheetTitle}>
                        {parent.name}
                    </Text>

                    <FlatList
                        data={children}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <Pressable
                                style={styles.sheetItem}
                                onPress={() => onSelect(item, parent)}
                            >
                                <Text style={styles.sheetText}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                    />

                </View>

            </View>
        </Modal>
    );
};

/* =============================
   STYLES
============================= */

const styles = StyleSheet.create({

    /* GRID */

    grid: {
        padding: 16,
        paddingBottom: 100, // 👈 prevents FAB overlap
    },

    cell: {
        width: "25%",
        alignItems: "center",
        marginBottom: 20,
    },

    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },

    label: {
        fontSize: 12,
        fontWeight: "500",
        color: "#111827",
        textAlign: "center",
    },

    /* SHEET */

    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 30,

        maxHeight: "75%",

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: {width: 0, height: -6},
        elevation: 20,
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 12,
    },

    sheetTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },

    sheetItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    sheetText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    /* FAB */

    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,

        width: 56,
        height: 56,
        borderRadius: 28,

        backgroundColor: "#2563EB",

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 4},
        elevation: 10,
    },
});