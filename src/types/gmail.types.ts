export interface GmailStatus {
    connected: boolean;
    email: string | null;
    lastSyncAt: string | null;
    watchExpiresAt: string | null;
    watchActive: boolean;
    watchStatus: "ACTIVE" | "EXPIRED";
    autoImportEnabled: boolean;
}