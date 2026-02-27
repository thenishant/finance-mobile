import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {ActivityIndicator, View} from "react-native";
import {useAuth} from "../hooks/useAuth";
import {AuthNavigator} from "./AuthNavigator";
import {AppStack} from "./AppStack";

export const RootNavigator = () => {
    const {token, loading} = useAuth();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {token ? (
                <AppStack key="app"/>
            ) : (
                <AuthNavigator key="auth"/>
            )}
        </NavigationContainer>
    );
};