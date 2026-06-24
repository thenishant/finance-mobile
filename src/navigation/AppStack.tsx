import React, {useEffect} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useQueryClient} from "@tanstack/react-query";

import {MainTabs} from "./MainTabs";
import AddTransactionScreen from "../screens/transactions/AddTransactionScreen";
import {SelectCategoryScreen} from "../screens/categories/SelectCategoryScreen";
import {SelectAccountScreen} from "../screens/accounts/SelectFinancialAccountScreen";
import {CreateAccountScreen} from "../screens/accounts/CreateAccountScreen";
import {CreateCategoryScreen} from "../screens/categories/CreateCategoryScreen";
import {InvestmentScreen} from "../screens/investment/InvestmentScreen";

import {Button} from "../components/ui";
import {TransactionType} from "../types/transaction";
import {transactionService} from "../services/transaction.service";

export type AppStackParamList = {
    Tabs: undefined;
    AddTransaction: { mode?: "create" | "edit"; transactionId?: string; } | undefined;
    SelectCategory: { type: TransactionType };
    SelectAccount: { mode: "source" | "destination" };
    ManageCategories: undefined;
    CreateAccount: undefined;
    CreateCategory: { type: TransactionType };
    Investment: undefined;
};

const Stack =
    createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ["transactions"],
            queryFn: transactionService.getAll,
        });
    }, []);

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerBackButtonDisplayMode: "minimal",
            }}
        >
            <Stack.Screen
                name="Tabs"
                component={MainTabs}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={({navigation}) => ({
                    title: "Add Transaction",
                    headerLeft: () => (
                        <Button
                            title="✕"
                            variant="ghost"
                            onPress={() =>
                                navigation.goBack()
                            }
                        />
                    ),
                })}
            />

            <Stack.Screen
                name="SelectAccount"
                component={SelectAccountScreen}
                options={{
                    title: "Select Account",
                }}
            />

            <Stack.Screen
                name="SelectCategory"
                component={SelectCategoryScreen}
                options={{
                    title: "Select Category",
                }}
            />

            <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{
                    title: "Create Account",
                }}
            />

            <Stack.Screen
                name="CreateCategory"
                component={CreateCategoryScreen}
                options={{
                    title: "Create Category",
                }}
            />

            <Stack.Screen
                name="Investment"
                component={InvestmentScreen}
                options={{
                    title: "Investment",
                }}
            />
        </Stack.Navigator>
    );
};