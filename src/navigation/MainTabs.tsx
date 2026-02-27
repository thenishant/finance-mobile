import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Feather} from "@expo/vector-icons";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import AccountsScreen from "../screens/accounts/AccountsScreen";
import TransactionListScreen from "../screens/transaction/TransactionListScreen";
import {AppStackParamList} from "./AppStack";

export type MainTabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Add: undefined;
    Accounts: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type StackNavigationProp =
    NativeStackNavigationProp<AppStackParamList>;

const EmptyScreen = () => null;

export const MainTabs = () => {
    const navigation = useNavigation<StackNavigationProp>();

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarIcon: ({color}) => {
                    if (route.name === "Dashboard") {
                        return <Feather name="home" size={22} color={color}/>;
                    }

                    if (route.name === "Transactions") {
                        return <Feather name="list" size={22} color={color}/>;
                    }

                    if (route.name === "Accounts") {
                        return (
                            <Feather name="credit-card" size={22} color={color}/>
                        );
                    }

                    if (route.name === "Add") {
                        return (
                            <View style={styles.floatingButton}>
                                <Feather name="plus" size={26} color="#FFFFFF"/>
                            </View>
                        );
                    }

                    return null;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen}/>
            <Tab.Screen name="Transactions" component={TransactionListScreen}/>

            <Tab.Screen
                name="Add"
                component={EmptyScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("AddTransaction");
                    },
                }}
            />

            <Tab.Screen name="Accounts" component={AccountsScreen}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        position: "absolute",
        height: 70,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 0,
        elevation: 15,
    },
    floatingButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -32,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
});