import React, {createContext, ReactNode, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {api} from "../services/api";

interface AuthContextType {
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    loading: true,
    login: async () => {
    },
    logout: async () => {
    }
});

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({children}: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("auth_token");
                if (storedToken) {
                    setToken(storedToken);
                    api.defaults.headers.common["Authorization"] =
                        `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.log("Token load error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (newToken: string) => {
        console.log("Setting token in context:", newToken);
        await SecureStore.setItemAsync("auth_token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        setToken(newToken);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("auth_token");
        delete api.defaults.headers.common["Authorization"];
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};