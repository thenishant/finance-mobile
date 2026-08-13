import React, {useRef} from "react";
import {Alert, Pressable, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";
import {transactionColors} from "../../../design/transactionColors";
import {TransactionType} from "../../../types/transaction";
import {colors} from "../../../design";

interface Props {
    id: string;
    type: TransactionType;
    amount: number;
    title?: string;
    category?: {
        name: string;
        parent?: {
            name: string;
        } | null;
    };
    account?: string;
    needsCategoryReview: boolean;
    onDelete: (id: string) => void;
    onPress: () => void;
}

export const TransactionItem = ({
                                    id,
                                    type,
                                    amount,
                                    title,
                                    category,
                                    account,
                                    needsCategoryReview,
                                    onDelete,
                                    onPress,
                                }: Props) => {
    const swipeRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                }, {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    swipeRef.current?.close();
                    onDelete(id);
                },
            },
            ]
        );
    };

    const categoryLabel = category?.name;
    const parentCategory = category?.parent?.name;

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={() => (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}>
                    <Feather
                        name="trash-2"
                        size={18}
                        color="#FFFFFF"/>
                </TouchableOpacity>
            )}
            overshootRight={false}>
            <Pressable
                onPress={onPress}
                android_ripple={{color: colors.white,}}
                style={styles.container}>
                <View style={styles.leftBlock}>

                    <View style={[styles.dot, {backgroundColor: transactionColors[type].primary}]}/>
                    <View style={styles.content}>
                        <View style={styles.titleRow}>
                            <Text
                                numberOfLines={1}
                                style={styles.category}>
                                {title?.trim() || categoryLabel || type}
                            </Text>

                            {needsCategoryReview && (
                                <View style={styles.reviewBadge}>
                                    <Text style={styles.reviewText}>
                                        Review
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text
                            numberOfLines={1}
                            style={styles.account}>
                            {[parentCategory, account]
                                .filter(Boolean)
                                .join(" • ")}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.amount, {color: transactionColors[type].primary}]}>
                    ₹{amount.toLocaleString("en-IN")}
                </Text>
            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
    },

    leftBlock: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
        marginRight: 12,
    },

    content: {
        flex: 1,
    },

    category: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0F172A",
    },

    account: {
        fontSize: 12,
        color: colors.grey,
        marginTop: 4,
    },

    amount: {
        fontSize: 16,
        fontWeight: "800",
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    deleteButton: {
        justifyContent: "center",
        backgroundColor: colors.red,
        alignItems: "center",
        width: 72,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    reviewBadge: {
        marginLeft: 8,
        backgroundColor: "#FEF3C7",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        flexShrink: 0,
    },
    reviewText: {
        color: "#B45309",
        fontSize: 10,
        fontWeight: "700",
    },
});