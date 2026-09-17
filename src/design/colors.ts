export const colors = {
    background: "#000814",

    surface: "#1c1c1c",
    // surface2: "#1A1A1F",
    // surface3: "#222228",

    border: "#2C2C33",

    text: "#FFFFFF",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",

    primary: "#4F8CFF",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#67C23A",

    white: "#FFFFFF",
    black: "#000000",
    textLight: "#D4D4D8",
    divider: "#26262B",

    overlay: "rgba(255,255,255,0.05)",

    cardShadow: "#000000",

    surfaceSecondary: "#1A1C20",

    surfaceElevated: "#22252A",

    muted: "#9CA3AF",
    heroStart: "#253B72",

    heroEnd: "#17181D",
    textMutedLight: "#A1A1AA",
    overlayLight: "rgba(255,255,255,0.05)",
    overlayMedium: "rgba(255,255,255,0.08)",
} as const;

export type ColorName = keyof typeof colors;