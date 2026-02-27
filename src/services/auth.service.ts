import {api} from "./api";
import {supabase} from "../lib/supabase";
import * as AuthSession from "expo-auth-session";

export const authService = {
    async login(email: string, password: string) {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        return response.data.data.token;
    },

    async register(email: string, password: string) {
        const response = await api.post("/auth/register", {
            email,
            password,
        });

        return response.data.data.token;
    },

    async googleOAuth() {
        const redirectTo = AuthSession.makeRedirectUri({
            scheme: "finance-mobile",
        });

        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        });

        if (error) throw error;
        console.log("Supabase OAuth response:", data);
        return {authUrl: data.url, redirectTo};
    },

    async logout() {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.log("Logout error:", error);
        }
    },
};