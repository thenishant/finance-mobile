import {create} from "zustand";

interface AuthState {
    token: string | null;
    loading: boolean;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    loading: true,
    setToken: (token) => set({token}),
    setLoading: (loading) => set({loading}),
}));