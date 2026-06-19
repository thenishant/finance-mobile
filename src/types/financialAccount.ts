export const ACCOUNT_TYPE_LABELS: Record<

    FinancialAccountType,
    string

> = {

    BANK_ACCOUNT: "Bank",

    CREDIT_CARD: "Credit Card",

    DEBIT_CARD: "Debit Card",

    CASH: "Cash",

    INVESTMENT: "Investment",

    LOAN: "Loan",

    WALLET: "Wallet",

};
export type FinancialAccountType =

    | "BANK_ACCOUNT"

    | "CREDIT_CARD"

    | "DEBIT_CARD"

    | "CASH"

    | "INVESTMENT"

    | "LOAN"

    | "WALLET";

export const ACCOUNT_TYPE_OPTIONS = [
    {
        value: "BANK_ACCOUNT",
        label: "Bank",
    },
    {
        value: "CREDIT_CARD",
        label: "Credit Card",
    },
    {
        value: "DEBIT_CARD",
        label: "Debit Card",
    },
    {
        value: "CASH",
        label: "Cash",
    },
    {
        value: "INVESTMENT",
        label: "Investment",
    },
    {
        value: "LOAN",
        label: "Loan",
    },
    {
        value: "WALLET",
        label: "Wallet",
    },
] as const;