import {useMemo} from "react";
import {GroupedTransaction, Transaction,} from "../types/transaction";
import {formatDateLabel} from "../utils/date";

export const useGroupedTransactions = (
    transactions: Transaction[],
    sortBy: "date" | "createdAt",
): GroupedTransaction[] => {

    return useMemo(() => {

        const grouped: Record<string, Transaction[]> = {};

        transactions.forEach((trx) => {

            const groupDate =
                sortBy === "createdAt"
                    ? trx.createdAt
                    : trx.date;

            const label = formatDateLabel(groupDate);

            if (!grouped[label]) {
                grouped[label] = [];
            }

            grouped[label].push(trx);
        });

        return Object.entries(grouped).map(
            ([date, transactions]) => ({
                date,
                transactions,
            }),
        );

    }, [transactions, sortBy]);
};