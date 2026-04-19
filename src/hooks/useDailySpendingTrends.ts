import {useQuery} from "@tanstack/react-query";
import {transactionService} from "../services/transaction.service";
import {useMemo} from "react";

export type DailySpendData = {
    date: string;
    day: string;
    amount: number;
};

export const useDailySpendingTrends = (days: number = 7) => {
    const {data: transactions = [], isLoading} = useQuery({
        queryKey: ["transactions"],
        queryFn: () => transactionService.getAll(),
        staleTime: 1000 * 60 * 5,
    });

    const trendData = useMemo(() => {
        const today = new Date();
        const data: DailySpendData[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const dayName = date.toLocaleDateString("en-US", {weekday: "short"});

            const dayTotal = transactions
                .filter((trx) => {
                    const trxDate = new Date(trx.date).toISOString().split("T")[0];
                    return trxDate === dateStr && trx.type === "EXPENSE";
                })
                .reduce((sum, trx) => sum + (typeof trx.amount === "string" ? parseFloat(trx.amount) : trx.amount || 0), 0);

            data.push({
                date: dateStr,
                day: dayName,
                amount: dayTotal,
            });
        }

        return data;
    }, [transactions, days]);

    return {
        data: trendData,
        isLoading,
    };
};


