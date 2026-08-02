export interface DashboardSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyInvestment: number;
    monthlySavings: number;
}

export interface DashboardComparisonMetric {
    amount: number;
    percent: number;
}

export interface DashboardComparison {
    current: DashboardSummary;
    previous: DashboardSummary;

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
    last4: string;
}

export interface DashboardCategory {
    id: string;
    name: string;
    amount: number;
    percentage: number;
}

export interface DashboardTransaction {
    id: string;
    amount: string;
    type: string;
    merchant: string | null;
    category: string | null;
    date: string;
}

export interface DashboardResponse {
    summary: DashboardSummary;
    comparison: DashboardComparison | null;
    accounts: DashboardAccount[];
    topCategories: DashboardCategory[];
    recentTransactions: DashboardTransaction[];
}