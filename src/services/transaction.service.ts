import {api} from "./api";
import {Transaction, TransactionType} from "../types/transaction";
import {unwrap} from "./base";

export type CreateTransactionPayload = {
    type: TransactionType;
    amount: number;
    date: string;

    categoryId?: string;

    sourceAccountId?: string;
    destinationAccountId?: string;

    note?: string;
};

export const transactionService = {
    async create(
        data: CreateTransactionPayload
    ): Promise<Transaction> {
        const payload = clean({
            type: data.type,
            amount: data.amount,
            date: data.date,

            categoryId: data.categoryId,

            sourceAccountId: data.sourceAccountId,
            destinationAccountId: data.destinationAccountId,

            note: data.note,
        });

        const res = await api.post(
            "/transactions",
            payload
        );

        return unwrap<Transaction>(res);
    },

    async getAll(): Promise<Transaction[]> {
        const res = await api.get("/transactions");

        return unwrap<Transaction[]>(res);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/transactions/${id}`);
    },

    async restore(id: string): Promise<void> {
        await api.post(
            `/transactions/${id}/restore`
        );
    },
};

function clean<T extends Record<string, unknown>>(
    obj: T
): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null
        )
    ) as Partial<T>;
}