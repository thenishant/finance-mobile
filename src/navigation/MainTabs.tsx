import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import TransactionListScreen from "../screens/transactions/TransactionListScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import {AppStackParamList} from "./AppStack";
import {colors} from "../design";
import {GmailScreen} from "../screens/gmail/GmailScreen";

export type MainTabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Add: undefined;
    Accounts: undefined;
    Analytics: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type StackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
const EmptyScreen = () => null;
export const MainTabs = () => {
    const navigation = useNavigation<StackNavigationProp>();
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: [styles.tabBarStyle, {
                    backgroundColor: colors.surface,
                    paddingBottom: insets.bottom,
                }],

                tabBarIcon: ({color}) => {
                    switch (route.name) {
                        case "Dashboard":
                            return (
                                <Ionicons name="home" size={22} color={color}/>);
                        case "Transactions":
                            return (
                                <Ionicons name="receipt-outline" size={22} color={color}/>);
                        case "Accounts":
                            return (
                                <Ionicons name="wallet-outline" size={22} color={color}/>
                            );

                        case "Analytics":
                            return (
                                <Ionicons name="pie-chart-outline" size={22} color={color}/>
                            );

                        case "Add":
                            return (
                                <View style={styles.floatingButton}>
                                    <Ionicons name="add" size={28} color={colors.white}/>
                                </View>
                            );
                        default:
                            return null;
                    }
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen}/>
            <Tab.Screen name="Transactions" component={TransactionListScreen}/>
            <Tab.Screen name="Add" component={EmptyScreen}
                        listeners={{
                            tabPress: e => {
                                e.preventDefault();
                                navigation.navigate("AddTransaction", {
                                    mode: "create",
                                });
                            }
                        }}
            />

            <Tab.Screen name="Accounts" component={GmailScreen}/>
            <Tab.Screen name="Analytics" component={AnalyticsScreen}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 70,
        borderTopWidth: 0,
        backgroundColor: colors.surface,
        elevation: 20,
        shadowColor: colors.cardShadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

    floatingButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -30,
        shadowColor: colors.cardShadow,
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 12,
    },
});