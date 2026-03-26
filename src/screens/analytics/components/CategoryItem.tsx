import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {Feather} from "@expo/vector-icons";

interface Child {
    id: string;
    name: string;
    total: number;
}

interface Props {
    category: string;
    total: number;
    percent: number;
    children: Child[];
}

export const CategoryItem = ({
                                 category,
                                 total,
                                 percent,
                                 children,
                             }: Props) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.8}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.category}>
                            {category}
                        </Text>
                        <Text style={styles.percent}>
                            {percent.toFixed(0)}%
                        </Text>
                    </View>

                    <View style={styles.right}>
                        <Text style={styles.amount}>
                            ₹ {total.toLocaleString("en-IN")}
                        </Text>
                        <Feather
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#6B7280"
                        />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.barBackground}>
                    <View
                        style={[
                            styles.barFill,
                            {width: `${percent}%`},
                        ]}
                    />
                </View>
            </TouchableOpacity>

            {expanded &&
                children.map((child) => (
                    <View key={child.id} style={styles.childRow}>
                        <Text style={styles.childName}>
                            {child.name}
                        </Text>
                        <Text style={styles.childAmount}>
                            ₹ {child.total.toLocaleString("en-IN")}
                        </Text>
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    category: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    percent: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    right: {
        alignItems: "flex-end",
        gap: 4,
    },
    amount: {
        fontSize: 14,
        fontWeight: "600",
    },
    barBackground: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        marginTop: 10,
        overflow: "hidden",
    },
    barFill: {
        height: 6,
        backgroundColor: "#2563EB",
        borderRadius: 3,
    },
    childRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    childName: {
        fontSize: 13,
        color: "#374151",
    },
    childAmount: {
        fontSize: 13,
        fontWeight: "500",
    },
});