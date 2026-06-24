import React, {useRef} from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";

interface Props {
    id: string;
    type: string;
    amount: number;
    title?: string;
    category?: string;
    account?: string;
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
                },
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

    const getColor = () => {
        switch (type) {
            case "INCOME":
                return "#16A34A";

            case "EXPENSE":
                return "#DC2626";

            case "INVESTMENT":
                return "#4F46E5";

            case "TRANSFER":
                return "#2563EB";

            default:
                return "#6B7280";
        }
    };

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={() => (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                >
                    <Feather
                        name="trash-2"
                        size={18}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            )}
            overshootRight={false}
        >
            <Pressable
                onPress={onPress}
                android_ripple={{
                    color: "#F1F5F9",
                }}
                style={styles.container}
            >
                <View style={styles.leftBlock}>
                    <View
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    getColor(),
                            },
                        ]}
                    />

                    <View style={styles.content}>
                        <Text
                            numberOfLines={1}
                            style={styles.category}
                        >
                            {title?.trim() ||
                                category ||
                                type}
                        </Text>

                        <Text
                            numberOfLines={1}
                            style={styles.account}
                        >
                            {[category, account]
                                .filter(Boolean)
                                .join(" • ")}
                        </Text>
                    </View>
                </View>

                <Text
                    style={[
                        styles.amount,
                        {
                            color: getColor(),
                        },
                    ]}
                >
                    ₹
                    {amount.toLocaleString(
                        "en-IN"
                    )}
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
        backgroundColor: "#FFFFFF",
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
        color: "#64748B",
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
        backgroundColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
        width: 72,
    },
});