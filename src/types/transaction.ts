import {LeafCategory} from "./category";
import {FinancialAccount} from "./api.types";

export const TRANSACTION_TYPES = [
    "EXPENSE",
    "INCOME",
    "TRANSFER",
    "INVESTMENT",
] as const;

export type TransactionType =
    typeof TRANSACTION_TYPES[number];

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: string;
    date: string;
    note?: string;
    category?: LeafCategory;
    sourceAccount?: FinancialAccount | null;
    destinationAccount?: FinancialAccount | null;
}

export interface GroupedTransaction {
    date: string;
    transactions: Transaction[];
}