import React, {useRef} from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View,} from "react-native";

import {Swipeable} from "react-native-gesture-handler";

import AppIcon from "../../../components/common/AppIcon";
import ListRow from "../../../components/common/ListRow";

import {AmountText, Body, Caption,} from "../../../components/typography";

import {colors, spacing,} from "../../../design";

import {financeIcons, FinanceIconType,} from "../../../design/icons";

import {TransactionType,} from "../../../types/transaction";
import {fontSize} from "../../../design/font";

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

const transactionIcon = (
    type: TransactionType,
): FinanceIconType => {
    switch (type) {
        case "INCOME":
            return "income";

        case "EXPENSE":
            return "expense";

        case "INVESTMENT":
            return "investment";

        case "TRANSFER":
            return "transfer";
    }
};

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
    const swipeRef =
        useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        swipeRef.current?.close();
                        onDelete(id);
                    },
                },
            ],
        );
    };

    const iconType =
        transactionIcon(type);

    const icon =
        financeIcons[iconType];

    const titleText =
        title?.trim() ||
        category?.name ||
        "Unknown";

    const metadata = [
        category?.parent?.name,
        category?.name,
        account,
    ].filter(Boolean);

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={() => (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                >
                    <AppIcon type="trash"/>
                </TouchableOpacity>
            )}
            overshootRight={false}
        >
            <ListRow
                onPress={onPress}
                left={
                    <AppIcon type={iconType}/>
                }
                title={
                    <View style={styles.titleRow}>
                        <Body
                            weight="regular"
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {titleText}
                        </Body>

                        {needsCategoryReview && (
                            <View style={styles.reviewBadge}>
                                <Text style={styles.reviewText}>
                                    Review
                                </Text>
                            </View>
                        )}
                    </View>
                }
                subtitle={
                    metadata.length > 0 ? (
                        <Caption
                            color="textSecondary"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {metadata.join(" • ")}
                        </Caption>
                    ) : undefined
                }
                trailing={
                    <AmountText
                        value={amount}
                        color={icon.color}
                        style={styles.amount}
                    />
                }
            />
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        minWidth: 0,
    },

    reviewBadge: {
        marginLeft: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 7,
        backgroundColor: "#3A2B0A",
    },

    reviewText: {
        fontSize: fontSize.xs,
        fontWeight: "bold",
        color: colors.warning,
    },

    amount: {
        fontSize: fontSize.lg,
        fontWeight: "regular"
    },

    deleteButton: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: spacing.sm
    },
});