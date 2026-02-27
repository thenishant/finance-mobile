export const TRANSACTION_TYPES = [
    "EXPENSE",
    "INCOME",
    "TRANSFER",
    "INVESTMENT"
] as const;

export type TransactionType =
    typeof TRANSACTION_TYPES[number];

