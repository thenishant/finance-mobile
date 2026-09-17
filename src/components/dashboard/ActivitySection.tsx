import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import SectionCard from "../common/SectionCard";
import ListRow from "../common/ListRow";
import AppIcon from "../common/AppIcon";

import {AmountText, Body, Caption,} from "../typography";

import {colors, spacing,} from "../../design";

import {financeIcons, FinanceIconType,} from "../../design/icons";
import {fontSize, fontWeight} from "../../design/font";
import {formatDate} from "../../utils/date";

export interface Transaction {
    id: string;
    merchant?: string | null;
    category?: string | null;
    amount: number;
    type: "INCOME" | "EXPENSE" | "INVESTMENT" | "TRANSFER";
    date: string;
}

interface Props {
    transactions: Transaction[];
    onPressTransaction?: (id: string) => void;
    onPressSeeAll?: () => void;
}

function transactionIcon(
    type: Transaction["type"],
): FinanceIconType {

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
}

export default function ActivitySection({
                                                      transactions,
                                                      onPressTransaction,
                                                      onPressSeeAll,
                                                  }: Props) {
    const visible = transactions.slice(0, 5);

    return (
        <SectionCard
            title="Recent Activity"
            actionLabel="See All"
            onActionPress={onPressSeeAll}
            footer={
                transactions.length > 4 && (
                    <Pressable onPress={onPressSeeAll}>
                        <Body
                            color="primary"
                            weight="medium"
                        >
                            View All Transactions →
                        </Body>
                    </Pressable>
                )
            }
        >

            {visible.map((transaction, index) => {
                const iconType = transactionIcon(transaction.type);
                const icon = financeIcons[iconType];
                return (
                    <View
                        key={transaction.id}
                        style={[
                            styles.row,
                            index !== visible.length - 1 &&
                            styles.divider,
                        ]}
                    >
                        <ListRow
                            onPress={() =>
                                onPressTransaction?.(
                                    transaction.id,
                                )
                            }
                            left={
                                <AppIcon
                                    type={iconType}
                                />
                            }
                            title={
                                <Body weight="regular">
                                    {transaction.merchant ??
                                        transaction.category ??
                                        "Unknown"}
                                </Body>
                            }
                            subtitle={
                                <Caption
                                    color="textSecondary"
                                >
                                    {transaction.category}
                                    {" • "}
                                    {formatDate(
                                        transaction.date,
                                    )}
                                </Caption>
                            }

                            trailing={
                                <AmountText
                                    value={transaction.amount}
                                    color={icon.color}
                                    style={styles.amount}
                                />
                            }
                        />
                    </View>
                );
            })}
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingVertical: spacing.xs,
    },

    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },

    amount: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.regular,
    },
});