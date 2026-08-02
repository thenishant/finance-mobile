import {LeafCategory} from "./category";
import {FinancialAccount} from "./api.types";

export const TRANSACTION_TYPES = [
    "EXPENSE",
    "INCOME",
    "TRANSFER",
    "INVESTMENT",
] as const;

export const TRANSACTION_TYPES_LABELS = [
    {
        value: TRANSACTION_TYPES[0],
        label: "Expense",
        emoji: "↗",
    },
    {
        value: TRANSACTION_TYPES[1],
        label: "Income",
        emoji: "↙",
    },
    {
        value: TRANSACTION_TYPES[2],
        label: "Transfer",
        emoji: "⇄",
    },
    {
        value: TRANSACTION_TYPES[3],
        label: "Invest",
        emoji: "◎",
    },
] as const;


export const CATEGORY_ASSIGNMENT_SOURCES = [
    "USER",
    "AI_EXISTING",
    "AI_NEW"
] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];
export type CategoryAssignmentSource = typeof CATEGORY_ASSIGNMENT_SOURCES[number];

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: string;
    date: string;
    note?: string;
    createdAt: string;
    category?: LeafCategory;
    merchant?: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    } | null;
    merchantNormalized?: string | null;
    sourceAccount?: FinancialAccount | null;
    destinationAccount?: FinancialAccount | null;
    categoryAssignmentSource: CategoryAssignmentSource;
    aiCategoryConfidence: number | null;
    needsCategoryReview: boolean;
}

export interface GroupedTransaction {
    date: string;
    transactions: Transaction[];
}