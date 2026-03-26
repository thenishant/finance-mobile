import React from "react";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {ActivityIndicator, View} from "react-native";
import {AuthNavigator} from "./AuthNavigator";
import {AppStack} from "./AppStack";
import {useAuth} from "../hooks/useAuth";

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#F5F7FA",
    },
};

export const RootNavigator = () => {
    const {token, loading} = useAuth();

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <NavigationContainer theme={AppTheme}>
            {token ? <AppStack/> : <AuthNavigator/>}
        </NavigationContainer>
    );
};