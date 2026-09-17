import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import SectionCard from "../common/SectionCard";
import ListRow from "../common/ListRow";
import ProgressBar from "../common/Progressbar";
import AppIcon from "../common/AppIcon";

import {AmountText, Body, Caption,} from "../typography";

import {colors, spacing,} from "../../design";

import {financeIcons} from "../../design/icons";
import {fontSize} from "../../design/font";
import {fontWeights} from "../theme/fontWeight";

export interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
    last4?: string | null;
}

interface Props {
    accounts: Account[];
    onPressAccount?: (id: string) => void;
    onPressSeeAll?: () => void;
}

export default function AccountsSection({
                                            accounts,
                                            onPressAccount,
                                            onPressSeeAll,
                                        }: Props) {

    const visibleAccounts = accounts.slice(0, 3);

    const maxBalance = Math.max(
        ...visibleAccounts.map(a => Math.abs(a.balance)),
        1,
    );

    return (

        <SectionCard
            title="Accounts"
            actionLabel="See All"
            onActionPress={onPressSeeAll}
            footer={
                accounts.length > 3 ? (
                    <Pressable onPress={onPressSeeAll}>
                        <Body color="primary" weight="medium">
                            +{accounts.length - 3} More Accounts →
                        </Body>
                    </Pressable>
                ) : undefined
            }
        >

            {visibleAccounts.map((account, index) => {
                const iconType = account.type === "BANK_ACCOUNT" ? "bank" : "creditCard";
                return (
                    <View
                        key={account.id}
                        style={[
                            styles.row,
                            index !== visibleAccounts.length - 1 &&
                            styles.divider,
                        ]}
                    >
                        <ListRow
                            onPress={() =>
                                onPressAccount?.(account.id)
                            }
                            left={
                                <AppIcon type={iconType}/>
                            }

                            title={
                                <Body weight="regular">
                                    {account.name}
                                </Body>
                            }

                            subtitle={
                                <Caption color="textSecondary">
                                    {account.type.replaceAll("_", " ")}
                                    {account.last4 && ` ••${account.last4}`}
                                </Caption>
                            }

                            trailing={
                                <AmountText
                                    value={account.balance}
                                    style={styles.amount}
                                />
                            }

                            bottom={
                                <ProgressBar
                                    progress={
                                        Math.abs(account.balance) /
                                        maxBalance
                                    }
                                    color={
                                        financeIcons[iconType].color
                                    }
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
        paddingVertical: spacing.xxs,
    },

    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },

    amount: {
        fontSize: fontSize.lg,
        fontWeight: fontWeights.regular,
    },

});