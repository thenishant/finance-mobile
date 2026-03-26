import {api} from "./api";
import {PaymentMethod} from "../types/payment";
import {Transaction, TransactionType} from "../types/transaction";
import {unwrap} from "./base";

type CreateTransactionPayload = {
    transactionType: TransactionType;
    paymentMethod: PaymentMethod;
    amount: number;
    date: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    note?: string;
};

export const transactionService = {

    async create(data: CreateTransactionPayload): Promise<Transaction> {

        const payload = clean({
            type: data.transactionType,
            paymentMethod: data.paymentMethod,
            amount: data.amount,
            date: data.date,
            categoryId: data.categoryId,
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId,
            note: data.note,
        });

        const res = await api.post("/transactions", payload);

        return unwrap<Transaction>(res);
    },

    async getAll(): Promise<Transaction[]> {
        const res = await api.get("/transactions");
        return unwrap<Transaction[]>(res);
    },

    async delete(id: string) {
        await api.delete(`/transactions/${id}`);
    }
};

/* =============================
   🔥 HELPER (KEY PART)
============================= */

function clean<T extends Record<string, any>>(obj: T): { [p: string]: any } {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    );
}