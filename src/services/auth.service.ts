import {api} from "./api";
import {unwrap} from "./base";
import {supabase} from "../lib/supabase";
import {UserProfile} from "../types/user.types";

export const authService = {
    async me(): Promise<UserProfile> {
        const res = await api.get("/auth/me");

        return unwrap<UserProfile>(res);
    },

    async login(
        email: string,
        password: string,
    ): Promise<string> {
        const res = await api.post(
            "/auth/login",
            {
                email,
                password,
            },
        );

        return unwrap<{ token: string }>(res).token;
    },

    async register(
        email: string,
        password: string,
    ): Promise<string> {
        const res = await api.post(
            "/auth/register",
            {
                email,
                password,
            },
        );

        return unwrap<{ token: string }>(res).token;
    },

    async startGoogleLogin() {
        const redirectTo = "finance-mobile://auth/callback";

        console.log(
            "OAuth redirect:",
            redirectTo,
        );

        const {data, error} =
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });

        if (error) {
            throw error;
        }

        if (!data?.url) {
            throw new Error(
                "Google OAuth URL not returned.",
            );
        }

        return {
            authUrl: data.url,
            redirectTo,
        };
    },

    async googleLogin(
        supabaseToken: string,
    ): Promise<string> {
        const res = await api.post(
            "/auth/google",
            {
                supabaseToken,
            },
        );

        return unwrap<{ token: string }>(res).token;
    },
};