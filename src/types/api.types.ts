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

export interface ExpenseChild {
    id: string;
    name: string;
    total: number;
}

export interface ExpenseCategory {
    category: string;
    total: number;
    children: ExpenseChild[];
}

export type InvestmentGoal = {
    percent: number;
    goalAmount: number;
    invested: number;
    remaining: number;
    progress: number;
};

export type MonthlyAnalytics = {
    totalIncome: number;
    totalExpense: number;
    totalInvestment: number;
    netSavings: number;

    investmentGoal?: InvestmentGoal | null;

    expenseBreakdown: {
        category: string;
        total: number;
        children: {
            id: string;
            name: string;
            total: number;
        }[];
    }[];
};