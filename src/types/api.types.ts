export interface User {
    id: string;
    email: string;
}

export interface Account {
    id: string;
    name: string;
    type: "SAVING" | "CURRENT" | "INVESTMENT";
    balance: number;
}

export interface Category {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    children?: Category[];
}

export interface MonthlyAnalytics {
    totalIncome: number;
    totalExpense: number;
    totalInvestment: number;
    netSavings: number;
}

export interface MonthComparison {
    current: MonthlyAnalytics;
    previous: MonthlyAnalytics;
    change: {
        income: { diff: number; percent: number | null };
        expense: { diff: number; percent: number | null };
        investment: { diff: number; percent: number | null };
        savings: { diff: number; percent: number | null };
    };
}