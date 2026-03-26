import {Ionicons} from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

const CATEGORY_MAP: Record<
    string,
    { icon: IconName; color: string }
> = {
    food: {icon: "restaurant", color: "#F59E0B"},
    grocery: {icon: "basket", color: "#22C55E"},
    bills: {icon: "receipt", color: "#3B82F6"},
    travel: {icon: "airplane", color: "#8B5CF6"},
    shopping: {icon: "cart", color: "#EC4899"},
    medical: {icon: "medkit", color: "#EF4444"},
    home: {icon: "home", color: "#243e15"},
    leisure: {icon: "game-controller", color: "#6366F1"},
    insurance: {icon: "shield-checkmark", color: "#0EA5E9"},
    salary: {icon: "wallet", color: "#22C55E"},
    alcohol: {icon: "beer", color: "#fe4c00"},
    entertainment: {icon: "musical-notes", color: "#EC4899"},
    education: {icon: "school", color: "#c51414"},
    transportation: {icon: "car", color: "#8B5CF6"},
};

const DEFAULT_META: { icon: IconName; color: string } = {
    icon: "grid",
    color: "#9CA3AF",
};

export const getCategoryMeta = (name: string) => {
    const key = name.toLowerCase();

    for (const k in CATEGORY_MAP) {
        if (key.includes(k)) {
            return CATEGORY_MAP[k];
        }
    }

    return DEFAULT_META;
};