import {fontSize} from "./font";

export const typography = {
    display: {
        fontSize: fontSize.xxxl,
        lineHeight: 48,
    },

    title: {
        fontSize: fontSize.xxl,
        lineHeight: 38,
    },

    heading: {
        fontSize: fontSize.xl,
        lineHeight: 30,
    },

    body: {
        fontSize: fontSize.md,
        lineHeight: 24,
    },

    caption: {
        fontSize: fontSize.sm,
        lineHeight: 18,
    },

    label: {
        fontSize: fontSize.xs,
        lineHeight: 16,
    },
} as const;