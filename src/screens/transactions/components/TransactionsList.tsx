import React from "react";
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, View,} from "react-native";

import {TransactionGroup} from "./TransactionGroup";

import {GroupedTransaction, Transaction,} from "../../../types/transaction";

import {Body} from "../../../components/typography";

import {ControlGroup} from "../../../components/common/ui";

import {colors, spacing,} from "../../../design";

interface Props {
    data: GroupedTransaction[];

    isLoading: boolean;
    refreshing: boolean;

    onRefresh: () => void;
    onDelete: (id: string) => void;
    onPress: (transaction: Transaction) => void;

    controls: React.ComponentProps<typeof ControlGroup>["controls"];
}

export const TransactionList = ({
                                    data,
                                    isLoading,
                                    refreshing,
                                    onRefresh,
                                    onDelete,
                                    onPress,
                                    controls,
                                }: Props) => {
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="small"
                    color={colors.primary}
                />

                <Body color="muted">
                    Loading transactions...
                </Body>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.content,
                !data.length && styles.emptyContent,
            ]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                />
            }
            ListHeaderComponent={
                <ControlGroup controls={controls}/>
            }
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Body weight="regular">
                        No transactions yet
                    </Body>

                    <Body color="muted">
                        Your transactions will appear here.
                    </Body>
                </View>
            }
            renderItem={({item}) => (
                <TransactionGroup
                    date={item.date}
                    transactions={item.transactions}
                    onDelete={onDelete}
                    onPress={onPress}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: spacing.xl,
    },

    emptyContent: {
        flexGrow: 1,
    },

    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
    },
});