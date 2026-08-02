import React from "react";
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View,} from "react-native";
import {TransactionGroup} from "./TransactionGroup";
import {GroupedTransaction, Transaction,} from "../../../types/transaction";
import {colors} from "../../../design/colors";

interface Props {
    data: GroupedTransaction[];
    isLoading: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onDelete: (id: string) => void;
    onPress: (transaction: Transaction) => void;
}

export const TransactionList = ({
                                    data,
                                    isLoading,
                                    refreshing,
                                    onRefresh,
                                    onDelete,
                                    onPress,
                                }: Props) => {
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>
                    No transactions yet
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.date}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}/>
            }
            renderItem={({item}) => (
                <TransactionGroup
                    date={item.date}
                    transactions={item.transactions}
                    onDelete={onDelete}
                    onPress={onPress}/>
            )}/>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 100,
        backgroundColor: colors.darkGrey,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.grey,
    },
});