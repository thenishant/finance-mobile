import * as WebBrowser from "expo-web-browser";
import {api} from "./api";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = "finance-mobile://gmail";

export interface GmailStatus {
    connected: boolean;
    email: string | null;
    lastSyncAt: string | null;
    watchExpiresAt: string | null;
    watchActive: boolean;
    watchStatus: "ACTIVE" | "EXPIRED";
    autoImportEnabled: boolean;
}

export interface RecentImport {
    id: string;
    merchant: string;
    category: string | null;
    amount: number;
    date: string;
}

const BASE_URL = "api/gmail";

export const gmailService = {
    async getStatus(): Promise<GmailStatus> {
        const {data} = await api.get(
            `${BASE_URL}/status`,
        );

        return data.data;
    },

    async connect() {
        console.log("[GMAIL] Starting connection");

        // Backend route is POST /api/gmail/connect
        const res = await api.post(
            `${BASE_URL}/connect`,
        );

        console.log(
            "[GMAIL] Connect response:",
            res.data,
        );

        const data = res.data.data;

        if (data.connected) {
            console.log(
                "[GMAIL] Already connected:",
                data.email,
            );

            return data;
        }

        if (!data.url) {
            throw new Error(
                "Gmail OAuth URL was not returned.",
            );
        }

        console.log(
            "[GMAIL] Opening OAuth:",
            data.url,
        );

        console.log(
            "[GMAIL] Redirect URI:",
            REDIRECT_URI,
        );

        const result =
            await WebBrowser.openAuthSessionAsync(
                data.url,
                REDIRECT_URI,
            );

        console.log(
            "[GMAIL] OAuth result:",
            result,
        );

        if (result.type !== "success") {
            throw new Error(
                "Google connection cancelled.",
            );
        }

        if (!result.url) {
            throw new Error(
                "Gmail OAuth callback URL missing.",
            );
        }

        console.log(
            "[GMAIL] Callback URL:",
            result.url,
        );

        return result;
    },

    async sync(maxResults?: number) {
        const {data} = await api.post(
            `${BASE_URL}/sync`,
            maxResults
                ? {maxResults}
                : {},
        );

        return data.data;
    },

    async disconnect() {
        const {data} = await api.delete(
            `${BASE_URL}/disconnect`,
        );

        return data.data;
    },

    async getRecentImports(): Promise<RecentImport[]> {
        const {data} = await api.get(
            `${BASE_URL}/recentImport`,
        );

        return data.data;
    },

    async startWatch() {
        const res = await api.post(
            `${BASE_URL}/watch`,
        );

        return res.data.data;
    },
};