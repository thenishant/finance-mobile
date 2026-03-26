import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LeafCategory} from "../types/category";

interface Item extends LeafCategory {
    count: number;
    lastUsed: number;
}

interface Store {
    recent: Item[];
    hydrated: boolean;
    add: (category: LeafCategory) => void;
    hydrate: () => Promise<void>;
}

const STORAGE_KEY = "recent_categories";

export const useRecentCategories = create<Store>((set, get) => ({

    recent: [],
    hydrated: false,

    hydrate: async () => {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
            set({recent: JSON.parse(data), hydrated: true});
        } else {
            set({hydrated: true});
        }
    },

    add: (category) => {

        const state = get();

        let updated = [...state.recent];

        const existing = updated.find(c => c.id === category.id);

        if (existing) {
            existing.count += 1;
            existing.lastUsed = Date.now();
        } else {
            updated.unshift({
                ...category,
                count: 1,
                lastUsed: Date.now(),
            });
        }

        updated.sort((a, b) =>
            b.count !== a.count
                ? b.count - a.count
                : b.lastUsed - a.lastUsed
        );

        updated = updated.slice(0, 6);

        set({recent: updated});

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

}));