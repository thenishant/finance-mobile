import "react-native-gesture-handler";
import "react-native-reanimated";

import React from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import {QueryClient} from "@tanstack/react-query";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {RootNavigator} from "./src/navigation/RootNavigator";
import {Toast} from "./src/components/ui/Toast";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 60,
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider>

                <BottomSheetModalProvider>

                    <PersistQueryClientProvider
                        client={queryClient}
                        persistOptions={{persister: asyncStoragePersister}}
                    >
                        <RootNavigator/>
                    </PersistQueryClientProvider>

                </BottomSheetModalProvider>
                <Toast/>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}