import React from "react";
import {StyleSheet, View} from "react-native";

import {AppText} from "../../../../components/common";
import {colors, spacing} from "../../../../design";
import {Transaction} from "../../../../types/transaction";
import SectionCard from "../../../../components/common/SectionCard";
import {formatDateTime} from "../../../../utils/date";

interface Props {
    transaction: Transaction;
}

function DetailRow({
                       label,
                       value,
                   }: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <View style={styles.row}>
            <AppText
                variant="body"
                color={colors.textSecondary}
            >
                {label}
            </AppText>

            <AppText
                variant="body"
                weight="semibold"
                numberOfLines={2}
                style={styles.value}
            >
                {value || "-"}
            </AppText>
        </View>
    );
}

export default function TransactionDetailsSection({
                                                      transaction,
                                                  }: Props) {
    return (
        <SectionCard>
            <DetailRow
                label="Type"
                value={transaction.type}
            />

            <DetailRow
                label="Time"
                value={formatDateTime(transaction.date)}
            />

            {transaction.category?.parent && (
                <DetailRow
                    label="Main Category"
                    value={transaction.category.parent.name}
                />
            )}

            {transaction.category && (
                <DetailRow
                    label="Sub Category"
                    value={transaction.category.name}
                />
            )}

            {transaction.sourceAccount?.name && (
                <DetailRow
                    label="From Account"
                    value={transaction.sourceAccount.name}
                />
            )}

            {transaction.destinationAccount?.name && (
                <DetailRow
                    label="To Account"
                    value={transaction.destinationAccount.name}
                />
            )}

            {transaction.note && (
                <DetailRow
                    label="Note"
                    value={transaction.note}
                />
            )}
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },

    value: {
        flex: 1,
        marginLeft: spacing.lg,
        textAlign: "right",
    },
});