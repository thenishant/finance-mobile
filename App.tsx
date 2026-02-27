import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {AuthProvider} from "./src/context/AuthContext";
import {RootNavigator} from "./src/navigation/RootNavigator";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,   // 5 minutes = data considered fresh
            gcTime: 1000 * 60 * 30,     // 30 minutes before cache garbage collection
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});
export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RootNavigator/>
                </AuthProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}