export type AuthProvider = "EMAIL" | "GOOGLE";

export interface UserProfile {
    id: string;
    email: string;
    authProvider: AuthProvider;
    createdAt: string;
}
