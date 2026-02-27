export const TRANSACTION_TYPES = [
    "EXPENSE",
    "INCOME",
    "TRANSFER",
    "INVESTMENT"
] as const;

export type TransactionType =
    typeof TRANSACTION_TYPES[number];

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string;
    category?: { name: string };
    fromAccount?: { name: string };
}