export interface InvestmentGoal {
    percent: number
    invested: number
    remaining: number
    goalAmount: number
    progress: number
}

export interface InvestmentMonth {
    month: number
    income: number
    expense: number
    investment: {
        invested: number
        goalAmount: number
        remaining: number
        progress: number
        status: "green" | "yellow" | "orange" | "red"
    }
}