import React from "react";
import {FlatList} from "react-native";
import {Screen} from "../../components/ui/Screen";
import {Button} from "../../components/ui";
import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useCategories} from "../../hooks/useCategories";

export const SelectCategoryScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const draft = useTransactionDraft();
    const {data: tree = []} = useCategories();

    const {type} = route.params;

    const categories = tree.flatMap((parent) =>
        parent.children
            .filter((child) => child.type === type)
            .map((child) => ({
                ...child,
                parent: {
                    id: parent.id,
                    name: parent.name,
                },
            }))
    );

    return (
        <Screen>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Button
                        title={`${item.parent?.name} / ${item.name}`}
                        variant="ghost"
                        onPress={() => {
                            draft.setSelectedCategory(item);
                            navigation.goBack();
                        }}
                    />
                )}
                ListFooterComponent={
                    <Button
                        title="+ Add Category"
                        onPress={() => navigation.navigate("CreateCategory", {type})}
                    />
                }
            />
        </Screen>
    );
};