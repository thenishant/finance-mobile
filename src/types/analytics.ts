export interface YearMonth {
    month: number;
    income: number;
    expense: number;
    savings: number;
    investment: {
        invested: number;
        goalPercent: number;
        goalAmount: number;
        remaining: number;
        progress: number;
        status: "red" | "green" | "yellow";
    };
}

export interface YearAnalytics {
    total: {
        totalIncome: number;
        totalExpense: number;
        totalInvestment: number;
        netSavings: number;
    };
    months: YearMonth[];
}