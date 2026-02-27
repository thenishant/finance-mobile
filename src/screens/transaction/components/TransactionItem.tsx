import React, {useRef} from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";

interface Props {
    id: string;
    type: string;
    amount: number;
    category?: string;
    account?: string;
    onDelete: (id: string) => void;
}

export const TransactionItem = ({
                                    id,
                                    type,
                                    amount,
                                    category,
                                    account,
                                    onDelete,
                                }: Props) => {

    const swipeRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {text: "Cancel", style: "cancel"},
                {
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

    const renderRightActions = () => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
        >
            <Feather name="trash-2" size={18} color="#fff"/>
        </TouchableOpacity>
    );

    const getColor = () => {
        if (type === "INCOME") return "#16A34A";
        if (type === "EXPENSE") return "#DC2626";
        if (type === "INVESTMENT") return "#4F46E5";
        return "#6B7280";
    };

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={renderRightActions}
            overshootRight={false}
        >
            <View style={styles.container}>
                <View style={styles.leftBlock}>
                    <View
                        style={[
                            styles.dot,
                            {backgroundColor: getColor()},
                        ]}
                    />

                    <View>
                        <Text style={styles.category}>
                            {category || type}
                        </Text>

                        {account && (
                            <Text style={styles.account}>
                                {account}
                            </Text>
                        )}
                    </View>
                </View>

                <Text style={[styles.amount, {color: getColor()}]}>
                    ₹ {amount.toLocaleString("en-IN")}
                </Text>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: "#FFFFFF",
    },
    category: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    account: {
        fontSize: 11,
        color: "#6B7280",
        marginTop: 2,
    },
    amount: {
        fontSize: 14,
        fontWeight: "600",
    },
    leftBlock: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
        width: 72,
    },
});