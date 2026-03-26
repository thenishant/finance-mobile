import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Feather} from "@expo/vector-icons";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import AccountsScreen from "../screens/accounts/AccountsScreen";
import TransactionListScreen from "../screens/transaction/TransactionListScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import {AppStackParamList} from "./AppStack";

export type MainTabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Add: undefined;
    Accounts: undefined;
    Analytics: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type StackNavigationProp =
    NativeStackNavigationProp<AppStackParamList>;

const EmptyScreen = () => null;

export const MainTabs = () => {
    const navigation = useNavigation<StackNavigationProp>();
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: [
                    styles.tabBarStyle,
                    {paddingBottom: insets.bottom},
                ],
                tabBarIcon: ({color}) => {
                    switch (route.name) {
                        case "Dashboard":
                            return <Feather name="home" size={22} color={color}/>;

                        case "Transactions":
                            return <Feather name="list" size={22} color={color}/>;

                        case "Accounts":
                            return (
                                <Feather name="credit-card" size={22} color={color}/>
                            );

                        case "Analytics":
                            return (
                                <Feather name="pie-chart" size={22} color={color}/>
                            );

                        case "Add":
                            return (
                                <View style={styles.floatingButton}>
                                    <Feather name="plus" size={26} color="#FFFFFF"/>
                                </View>
                            );

                        default:
                            return null;
                    }
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
            <Tab.Screen name="Analytics" component={AnalyticsScreen}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 70,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 0,
        elevation: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    floatingButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -30,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 12,
    },
});