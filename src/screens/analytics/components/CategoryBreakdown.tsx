import React from "react";
import {FlatList, StyleSheet} from "react-native";
import {CategoryItem} from "./CategoryItem";

interface Child {
    id: string;
    name: string;
    total: number;
}

interface Category {
    category: string;
    total: number;
    children: Child[];
}

interface Props {
    data: {
        totalExpense: number;
        expenseBreakdown: Category[];
    };
}

export const CategoryBreakdown = ({data}: Props) => {
    const {totalExpense, expenseBreakdown} = data;

    return (
        <FlatList
            data={expenseBreakdown}
            keyExtractor={(item) => item.category}
            contentContainerStyle={{gap: 14}}
            renderItem={({item}) => (
                <CategoryItem
                    category={item.category}
                    total={item.total}
                    percent={
                        totalExpense
                            ? (item.total / totalExpense) * 100
                            : 0
                    }
                    children={item.children}
                />
            )}
        />
    );
};
const styles = StyleSheet.create({
    container: {
        gap: 14,
    },
});