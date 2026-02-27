import {useMemo} from "react";
import {GroupedTransaction, Transaction} from "../types/transaction";
import {formatDateLabel} from "../utils/date";

export const useGroupedTransactions = (
    transactions: Transaction[]
): GroupedTransaction[] => {
    return useMemo(() => {
        const grouped: Record<string, Transaction[]> = {};

        transactions.forEach((trx) => {
            const label = formatDateLabel(trx.date);

            if (!grouped[label]) {
                grouped[label] = [];
            }

            grouped[label].push(trx);
        });

        return Object.entries(grouped).map(([date, list]) => ({
            date,
            transactions: list,
        }));
    }, [transactions]);
};