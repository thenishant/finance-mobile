import {useCallback} from "react";

import {queryClient} from "../lib/queryClient";
import {supabase} from "../lib/supabase";

import {authService} from "../services/auth.service";

import {useAuthStore} from "../stores/useAuthStore";

export const useAuth = () => {

    const token =
        useAuthStore(state => state.token);

    const loading =
        useAuthStore(state => state.loading);

    const initialize =
        useAuthStore(state => state.initialize);

    const login =
        useAuthStore(state => state.login);

    const clearSession =
        useAuthStore(state => state.clearSession);

    const loginWithPassword = useCallback(
        async (
            email: string,
            password: string,
        ) => {

            const token =
                await authService.login(
                    email,
                    password,
                );

            await login(token);

        },
        [login],
    );

    const loginWithToken = useCallback(
        async (
            token: string,
        ) => {

            await login(token);

        },
        [login],
    );

    const loginWithGoogle = useCallback(
        async (supabaseToken: string) => {
            const token =
                await authService.googleLogin(
                    supabaseToken,
                );

            await login(token);
        },
        [login],
    );

    const logout = useCallback(
        async () => {

            try {

                await supabase.auth.signOut();

            } catch (error) {

                console.warn(
                    "Supabase logout failed",
                    error,
                );

            }

            await clearSession();

            queryClient.clear();

        },
        [clearSession],
    );

    return {
        token,
        loading,
        isAuthenticated: !!token,
        initialize,
        loginWithPassword,
        loginWithToken,
        loginWithGoogle,
        logout,
        clearSession,
    };

};