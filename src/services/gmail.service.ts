import * as WebBrowser from "expo-web-browser";
import {api} from "./api";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URI = "finance-mobile://gmail";

export interface GmailStatus {
    connected: boolean;
    email: string | null;
    lastSyncAt: string | null;
}

export const gmailService = {
    async getStatus(): Promise<GmailStatus> {
        const res = await api.get("api/gmail/status");
        return res.data.data;
    },

    async connect() {
        const res = await api.get("api/gmail/url");
        console.log(res.data.data.url);
        const {url} = res.data.data as { url: string };
        const result = await WebBrowser.openAuthSessionAsync(
            url,
            REDIRECT_URI
        );
        if (result.type !== "success") {
            throw new Error("Google connection cancelled.");
        }
        return result;
    },

    async sync(maxResults: number) {
        const res = await api.post("api/gmail/sync", {
            maxResults,
        });
        return res.data.data;
    },

    async disconnect() {
        return api.delete("api/gmail");
    },
};