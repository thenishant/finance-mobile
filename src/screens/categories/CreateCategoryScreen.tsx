import React, {useMemo, useState} from "react";
import {Screen} from "../../components/ui/Screen";
import {Button, Input} from "../../components/ui";
import {StyleSheet, Text, View} from "react-native";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {AppStackParamList} from "../../navigation/AppStack";
import {categoryService} from "../../services/category.service";

type Nav = NativeStackNavigationProp<AppStackParamList>;
type RouteProps = RouteProp<AppStackParamList, "CreateCategory">;

export const CreateCategoryScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteProps>();
    const queryClient = useQueryClient();

    const {type} = route.params;

    const [category, setCategory] = useState("");
    const [subcategories, setSubcategories] = useState("");

    const previewItems = useMemo(
        () =>
            subcategories
                .split(",")
                .map(item => item.trim())
                .filter(Boolean),
        [subcategories]
    );

    const mutation = useMutation({
        mutationFn: categoryService.createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            navigation.goBack();
        },
    });

    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.label}>Category Name</Text>
                    <Input
                        placeholder="e.g. Food & Dining"
                        value={category}
                        onChangeText={setCategory}
                    />

                    <Text style={styles.label}>Subcategories</Text>

                    <Input
                        placeholder="Restaurants, Coffee, Groceries"
                        value={subcategories}
                        onChangeText={setSubcategories}
                    />

                    {previewItems.length > 0 && (
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewTitle}>
                                Preview
                            </Text>

                            <View style={styles.chips}>
                                {previewItems.map(item => (
                                    <View key={item} style={styles.chip}>
                                        <Text style={styles.chipText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                </View>

                <Button
                    title={mutation.isPending ? "Saving..." : "Create Category"}
                    disabled={mutation.isPending || !category.trim()}
                    onPress={() => {
                        const children = subcategories
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean);

                        mutation.mutate({
                            name: category.trim(),
                            type,
                            children,
                        });
                    }}
                />

            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 10
    },
    header: {
        gap: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 16,
        gap: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    previewContainer: {
        marginTop: 4,
    },
    previewTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6B7280",
        marginBottom: 10,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    chipText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#334155",
    },
});