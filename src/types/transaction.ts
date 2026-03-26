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
    amount: string;
    date: string;
    category?: {
        id: string;
        name: string;
        parent?: {
            id: string;
            name: string;
        };
    };
    fromAccount?: {
        id: string;
        name: string;
    };
    toAccount?: {
        id: string;
        name: string;
    };
}

export interface GroupedTransaction {
    date: string;
    transactions: Transaction[];
}