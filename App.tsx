import "react-native-gesture-handler";
import "react-native-reanimated";

import React from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {queryClient} from "./src/lib/queryClient";
import {RootNavigator} from "./src/navigation/RootNavigator";
import {AuthBootstrap} from "./src/navigation/AuthBootstrap";

const asyncStoragePersister =
    createAsyncStoragePersister({
        storage: AsyncStorage,
        key: "REACT_QUERY_CACHE",
    });

export default function App() {

    return (

        <GestureHandlerRootView
            style={{flex: 1}}
        >

            <SafeAreaProvider>

                <BottomSheetModalProvider>

                    <PersistQueryClientProvider
                        client={queryClient}
                        persistOptions={{
                            persister: asyncStoragePersister,
                        }}
                    >
                        <AuthBootstrap/>
                        <RootNavigator/>
                    </PersistQueryClientProvider>
                </BottomSheetModalProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );

}