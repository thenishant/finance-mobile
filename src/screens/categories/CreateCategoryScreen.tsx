import React, {useState} from "react";
import {Screen} from "../../components/ui/Screen";
import {Button, Input} from "../../components/ui";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {AppStackParamList} from "../../navigation/AppStack";
import {categoryService} from "../../services/category.service";

type Nav = NativeStackNavigationProp<AppStackParamList>;
type RouteProps = RouteProp<AppStackParamList, "CreateCategory">;

export const CreateCategoryScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteProps>();
    const queryClient = useQueryClient();

    const {type} = route.params;

    const [category, setCategory] = useState("");
    const [subcategories, setSubcategories] = useState("");

    const mutation = useMutation({
        mutationFn: categoryService.createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            navigation.goBack();
        },
    });

    return (
        <Screen>
            <Input
                placeholder="Category (Parent)"
                value={category}
                onChangeText={setCategory}
            />

            <Input
                placeholder="Subcategories (comma separated)"
                value={subcategories}
                onChangeText={setSubcategories}
            />

            <Button
                title={mutation.isPending ? "Saving..." : "Save"}
                disabled={mutation.isPending}
                onPress={() => {
                    const children = subcategories
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);

                    mutation.mutate({
                        name: category,
                        type,
                        children,
                    });
                }}
            />
        </Screen>
    );
};