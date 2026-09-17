import React from "react";
import {StyleSheet, View} from "react-native";
import {Transaction} from "../../../types/transaction";
import {TransactionItem} from "./TransactionItem";
import SectionCard from "../../../components/common/SectionCard";
import {Caption} from "../../../components/typography";
import {colors, spacing} from "../../../design";

interface Props {
    date: string;
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onPress: (transaction: Transaction) => void;
}

export const TransactionGroup = ({
                                     date,
                                     transactions,
                                     onDelete,
                                     onPress,
                                 }: Props) => {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Caption color="muted">
                    {date}
                </Caption>

                <Caption color="muted">
                    {transactions.length}{" "}
                    {transactions.length === 1 ? "transaction" : "transactions"}
                </Caption>
            </View>

            <SectionCard>
                {transactions.map(
                    (transaction, index) => (
                        <React.Fragment
                            key={transaction.id}
                        >
                            <TransactionItem
                                id={transaction.id}
                                type={transaction.type}
                                amount={Number(
                                    transaction.amount,
                                )}
                                title={
                                    transaction.merchant?.name ??
                                    transaction.merchantNormalized ??
                                    undefined
                                }
                                category={
                                    transaction.category
                                }
                                account={
                                    transaction
                                        .sourceAccount?.name ??
                                    transaction
                                        .destinationAccount?.name
                                }
                                needsCategoryReview={
                                    transaction.needsCategoryReview
                                }
                                onDelete={onDelete}
                                onPress={() =>
                                    onPress(transaction)
                                }
                            />

                            {index <
                                transactions.length - 1 && (
                                    <View
                                        style={styles.divider}
                                    />
                                )}
                        </React.Fragment>
                    ),
                )}
            </SectionCard>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.sm,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm,
    },

    divider: {
        height: spacing.xxs,
        backgroundColor: colors.border,
    },
});