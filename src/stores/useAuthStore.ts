import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {supabase} from "../lib/supabase";
import {queryClient} from "../lib/queryClient";

let logoutPromise: Promise<void> | null = null;

interface AuthState {

    token: string | null;

    loading: boolean;

    initialize: () => Promise<void>;

    login: (token: string) => Promise<void>;
    clearSession: () => Promise<void>;
    logout: () => Promise<void>;

}

export const useAuthStore =
    create<AuthState>((set) => ({

        token: null,

        loading: true,

        initialize: async () => {

            try {

                const token =
                    await AsyncStorage.getItem(
                        "access_token",
                    );

                set({
                    token,
                    loading: false,
                });

            } catch {

                set({
                    token: null,
                    loading: false,
                });

            }

        },

        login: async token => {

            await AsyncStorage.setItem(
                "access_token",
                token,
            );

            set({
                token,
                loading: false,
            });

        },

        clearSession: async () => {
            set({
                token: null,
                loading: false,
            });
        },

        logout: async () => {

            if (logoutPromise) {
                return logoutPromise;
            }

            logoutPromise = (async () => {

                try {

                    await supabase.auth.signOut();

                } catch (e) {

                    console.warn(
                        "Supabase signOut failed",
                        e,
                    );

                }

                await AsyncStorage.multiRemove([
                    "access_token",
                    "REACT_QUERY_CACHE",
                ]);

                queryClient.clear();

                set({
                    token: null,
                    loading: false,
                });

            })();

            try {

                await logoutPromise;

            } finally {

                logoutPromise = null;

            }

        },

    }));