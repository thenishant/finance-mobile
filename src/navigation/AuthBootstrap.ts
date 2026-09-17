import {useEffect, useRef} from "react";

import {api} from "../services/api";

import {supabase} from "../lib/supabase";

import {useAuthStore} from "../stores/useAuthStore";

export function AuthBootstrap() {

    const initialize =
        useAuthStore(state => state.initialize);

    const login =
        useAuthStore(state => state.login);

    const clearSession =
        useAuthStore(state => state.clearSession);

    const exchanging =
        useRef(false);

    /**
     * Restore app token from storage
     */
    useEffect(() => {

        void initialize();

    }, [initialize]);

    /**
     * Listen for Supabase auth changes
     */
    useEffect(() => {

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange(
            async (
                event,
                session,
            ) => {

                console.log(
                    "[AUTH]",
                    event,
                );

                /**
                 * User logged out
                 */
                if (
                    event === "SIGNED_OUT"
                ) {

                    await clearSession();

                    return;

                }

                /**
                 * Ignore duplicate SIGNED_IN events
                 */
                if (
                    exchanging.current
                ) {

                    return;

                }

                /**
                 * Google login
                 */
                if (
                    event === "SIGNED_IN" &&
                    session?.access_token
                ) {

                    exchanging.current = true;

                    try {

                        const res =
                            await api.post(
                                "/auth/google",
                                {
                                    supabaseToken:
                                    session.access_token,
                                },
                            );

                        await login(
                            res.data.data.token,
                        );

                    } catch (error) {

                        console.error(
                            "[AUTH]",
                            error,
                        );

                        await clearSession();

                    } finally {

                        exchanging.current = false;

                    }

                }

                /**
                 * Useful for debugging
                 */
                if (
                    event ===
                    "TOKEN_REFRESHED"
                ) {

                    console.log(
                        "[AUTH] Token refreshed",
                    );

                }

            },
        );

        return () => {

            subscription.unsubscribe();

        };

    }, [
        login,
        clearSession,
    ]);

    return null;

}