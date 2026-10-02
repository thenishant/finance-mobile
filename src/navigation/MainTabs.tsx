import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";
import {BottomTabBarProps, createBottomTabNavigator,} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import TransactionListScreen from "../screens/transactions/TransactionListScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import {colors} from "../design";

export type MainTabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Gmail: undefined;
    Analytics: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<
    keyof MainTabParamList,
    React.ComponentProps<typeof Ionicons>["name"]
> = {
    Dashboard: "home",
    Transactions: "receipt-outline",
    Gmail: "mail-outline",
    Analytics: "pie-chart-outline",
};

function CustomTabBar({state, navigation}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    const routes = state.routes;

    return (
        <View
            style={[
                styles.tabBar,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <View style={styles.tabRow}>
                {routes.slice(0, 2).map((route, index) => {
                    const focused =
                        state.index === index;

                    return (
                        <Pressable
                            key={route.key}
                            onPress={() => {
                                navigation.navigate(route.name);
                            }}
                            style={styles.tab}
                        >
                            <Ionicons
                                name={tabIcons[route.name as keyof MainTabParamList]}
                                size={26}
                                color={
                                    focused
                                        ? colors.primary
                                        : colors.textMuted
                                }
                            />
                        </Pressable>
                    );
                })}

                <View style={styles.addSlot}>
                    <Pressable
                        onPress={() =>
                            navigation.navigate(
                                "AddTransaction",
                                {
                                    mode: "create",
                                },
                            )
                        }
                        style={styles.addButton}
                    >
                        <Ionicons
                            name="add"
                            size={36}
                            color={colors.white}
                        />
                    </Pressable>
                </View>

                {routes.slice(2).map((route, index) => {
                    const routeIndex = index + 2;

                    const focused =
                        state.index === routeIndex;

                    return (
                        <Pressable
                            key={route.key}
                            onPress={() => {
                                navigation.navigate(route.name);
                            }}
                            style={styles.tab}
                        >
                            <Ionicons
                                name={tabIcons[route.name as keyof MainTabParamList]}
                                size={26}
                                color={focused ? colors.primary : colors.textMuted}
                            />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export const MainTabs = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => (
                <CustomTabBar {...props} />
            )}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
            />

            <Tab.Screen
                name="Transactions"
                component={TransactionListScreen}
            />

            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        borderTopWidth: 0,
        shadowColor: colors.cardShadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

    tabRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    tab: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    addSlot: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    addButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -30,
        shadowColor: colors.cardShadow,
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 12,
    },
});