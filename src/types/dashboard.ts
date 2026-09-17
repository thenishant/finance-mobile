export interface DashboardSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyInvestment: number;
    monthlySavings: number;
}

export interface DashboardComparisonMetric {
    diff: number;
    percent: number | null;
}

export interface DashboardComparisonSummary {
    totalIncome: number;
    totalExpense: number;
    totalInvestment: number;
    netSavings: number;
}

export interface DashboardComparison {
    current: DashboardComparisonSummary;
    previous: DashboardComparisonSummary;

    change: {
        income: DashboardComparisonMetric;
        expense: DashboardComparisonMetric;
        investment: DashboardComparisonMetric;
        savings: DashboardComparisonMetric;
    };
}

export interface DashboardAccount {
    id: string;
    name: string;
    type: string;
    balance: number;
    last4: string | null;
}

export interface DashboardCategory {
    categoryId: string | null;
    name: string;
    total: number;
}

export interface DashboardTransaction {
    id: string;
    merchant: string | null;
    category: string | null;
    amount: number;
    type: "INCOME" | "EXPENSE" | "INVESTMENT" | "TRANSFER";
    date: string;
}

export interface DashboardResponse {
    summary: DashboardSummary;
    comparison: DashboardComparison;
    accounts: DashboardAccount[];
    topCategories: DashboardCategory[];
    recentTransactions: DashboardTransaction[];
}

export interface Merchant {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}