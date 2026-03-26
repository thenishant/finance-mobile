import {api} from "./api";
import {supabase} from "../lib/supabase";
import * as AuthSession from "expo-auth-session";
import {unwrap} from "./base";

export const authService = {

    async login(email: string, password: string): Promise<string> {
        const res = await api.post("/auth/login", {email, password});
        return unwrap<{ token: string }>(res).token;
    },

    async register(email: string, password: string): Promise<string> {
        const res = await api.post("/auth/register", {email, password});
        return unwrap<{ token: string }>(res).token;
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

        return {
            authUrl: data.url,
            redirectTo,
        };
    },

    async logout() {
        await supabase.auth.signOut();
    },
};