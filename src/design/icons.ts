import {Ionicons} from "@expo/vector-icons";

import {colors} from "./colors";

export type FinanceIconType =
    | "income"
    | "expense"
    | "investment"
    | "savings"
    | "bank"
    | "creditCard"
    | "transfer"
    | "mail"
    | "time"
    | "checkmark"
    | "alert"
    | "trash";

export interface FinanceIcon {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
    background: string;
}

export const financeIcons: Record<
    FinanceIconType,
    FinanceIcon
> = {

    income: {
        icon: "arrow-down-circle-outline",
        color: colors.success,
        background: `${colors.success}15`,
    },

    expense: {
        icon: "arrow-up-circle-outline",
        color: colors.danger,
        background: `${colors.danger}15`,
    },

    investment: {
        icon: "trending-up-outline",
        color: colors.primary,
        background: `${colors.primary}15`,
    },

    savings: {
        icon: "wallet-outline",
        color: colors.warning,
        background: `${colors.warning}15`,
    },

    bank: {
        icon: "card-outline",
        color: colors.primary,
        background: `${colors.primary}15`,
    },

    creditCard: {
        icon: "card",
        color: colors.warning,
        background: `${colors.warning}15`,
    },

    transfer: {
        icon: "swap-horizontal-outline",
        color: colors.info,
        background: `${colors.info}15`,
    },

    mail: {
        icon: "mail-outline",
        color: colors.primary,
        background: `${colors.primary}15`,
    },

    time: {
        icon: "time-outline",
        color: colors.info,
        background: `${colors.info}15`,
    },

    checkmark: {
        icon: "checkmark-circle-outline",
        color: colors.success,
        background: `${colors.success}15`,
    },

    alert: {
        icon: "alert-circle-outline",
        color: colors.warning,
        background: `${colors.warning}15`,
    },

    trash: {
        icon: "trash-outline",
        color: colors.danger,
        background: `${colors.danger}50`,
    },
};