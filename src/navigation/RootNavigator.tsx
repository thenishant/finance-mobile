import React from "react";

import {ActivityIndicator, View,} from "react-native";

import {DarkTheme, NavigationContainer,} from "@react-navigation/native";

import {AuthNavigator} from "./AuthNavigator";
import {AppStack} from "./AppStack";

import {useAuth} from "../hooks/useAuth";
import {colors} from "../design";

const AppTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.surface,
    },
};

export const RootNavigator = () => {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {

        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <NavigationContainer theme={AppTheme}>
            {isAuthenticated ? <AppStack/> : <AuthNavigator/>}
        </NavigationContainer>
    );
};