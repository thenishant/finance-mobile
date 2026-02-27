import {api} from "./api";
import {PaymentMethod} from "../types/payment";
import {Transaction, TransactionType} from "../types/transaction";

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
    async create(data: CreateTransactionPayload) {
        const response = await api.post("/transactions", data);
        return response.data.data;
    },

    async getAll(): Promise<Transaction[]> {
        const res = await api.get("/transactions");
        return res.data.data;
    },

    async delete(id: string) {
        await api.delete(`/transactions/${id}`);
    }
};