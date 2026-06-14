export type FinancialAccountType =
    | "BANK_ACCOUNT"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "CASH"
    | "INVESTMENT"
    | "LOAN"
    | "WALLET";

export const FINANCIAL_ACCOUNT_TYPES: FinancialAccountType[] = [
    "BANK_ACCOUNT",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "CASH",
    "INVESTMENT",
    "LOAN",
    "WALLET",
];

export const FINANCIAL_ACCOUNT_TYPE_LABELS: Record<FinancialAccountType, string> = {
    BANK_ACCOUNT: "Bank Account",
    CREDIT_CARD: "Credit Card",
    DEBIT_CARD: "Debit Card",
    CASH: "Cash",
    INVESTMENT: "Investment",
    LOAN: "Loan",
    WALLET: "Wallet",
};