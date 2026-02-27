import React from "react";
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View,} from "react-native";
import {TransactionGroup} from "./TransactionGroup";
import {GroupedTransaction} from "../../../types/transaction";

interface Props {
    data: GroupedTransaction[];
    isLoading: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onDelete: (id: string) => void;
}

export const TransactionList = ({
                                    data,
                                    isLoading,
                                    refreshing,
                                    onRefresh,
                                    onDelete,
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
            contentContainerStyle={styles.content}
            data={data}
            keyExtractor={(item) => item.date}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            renderItem={({item}) => (
                <TransactionGroup
                    date={item.date}
                    transactions={item.transactions}
                    onDelete={onDelete}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingBottom: 80,
        backgroundColor: "#F5F7FA",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#6B7280",
    },
});