import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MainTabs} from "./MainTabs";
import AddTransactionScreen from "../screens/transaction/AddTransactionScreen";
import {Button} from "../components/ui";
import {SelectCategoryScreen} from "../screens/categories/SelectCategoryScreen";
import {SelectAccountScreen} from "../screens/transaction/SelectAccountScreen";
import {CreateAccountScreen} from "../screens/transaction/CreateAccountScreen";
import {CreateCategoryScreen} from "../screens/categories/CreateCategoryScreen";
import {TransactionType} from "../types/transaction";

export type AppStackParamList = {
    Tabs: undefined;
    AddTransaction: undefined;
    SelectCategory: { type: TransactionType };
    SelectAccount: undefined;
    ManageCategories: undefined;
    CreateAccount: undefined;
    CreateCategory: { type: TransactionType };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Tabs"
                component={MainTabs}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={({navigation}) => ({
                    title: "Add Transaction",
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <Button
                            title="✕"
                            variant="ghost"
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />

            <Stack.Screen
                name="SelectAccount"
                component={SelectAccountScreen}
                options={{title: "Select Account"}}
            />

            <Stack.Screen
                name="SelectCategory"
                component={SelectCategoryScreen}
                options={{title: "Select Category"}}
            />

            <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{title: "Create Account"}}
            />

            <Stack.Screen
                name="CreateCategory"
                component={CreateCategoryScreen}
                options={{title: "Create Category"}}
            />
        </Stack.Navigator>
    );
};