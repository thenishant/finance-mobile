import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useQueryClient} from "@tanstack/react-query";
import {authService} from "../services/auth.service";
import {useAuthStore} from "../stores/useAuthStore";

export const useAuth = () => {
    const {token, loading, setToken, setLoading} = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem("access_token");
            setToken(storedToken);
            setLoading(false);
        };

        loadToken();
    }, []);

    const loginWithPassword = async (email: string, password: string) => {
        const newToken = await authService.login(email, password);

        await AsyncStorage.setItem("access_token", newToken);
        setToken(newToken);
    };

    const loginWithToken = async (newToken: string) => {
        await AsyncStorage.setItem("access_token", newToken);
        setToken(newToken);
    };

    const logout = async () => {
        await authService.logout();

        await AsyncStorage.removeItem("access_token");

        // Clear React Query cache
        queryClient.clear();

        setToken(null);
    };

    return {
        token,
        loading,
        loginWithPassword,
        loginWithToken,
        logout,
    };
};