import {api} from "./api";
import {Transaction, TransactionType,} from "../types/transaction";
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

export type UpdateTransactionRequest =
    CreateTransactionPayload & {
    updateMerchantMapping?: boolean;
};

export type TransactionSortBy =
    | "date"
    | "createdAt";

export type TransactionOrder =
    | "asc"
    | "desc";

export type TransactionFilters = {
    type?: TransactionType;
    accountType?:
        | "BANK_ACCOUNT"
        | "CREDIT_CARD"
        | "DEBIT_CARD"
        | "CASH"
        | "INVESTMENT"
        | "LOAN"
        | "WALLET";
    categoryId?: string;
    accountId?: string;
    from?: string;
    to?: string;
};

export type GetTransactionsParams =
    TransactionFilters & {
    sortBy?: TransactionSortBy;
    order?: TransactionOrder;
};

export const transactionService = {
    async create(
        data: CreateTransactionPayload,
    ): Promise<Transaction> {
        const payload = clean({
            type: data.type,
            amount: data.amount,
            date: data.date,
            categoryId: data.categoryId,
            sourceAccountId:
            data.sourceAccountId,
            destinationAccountId:
            data.destinationAccountId,
            note: data.note,
        });

        const res = await api.post(
            "/transactions",
            payload,
        );

        return unwrap<Transaction>(res);
    },

    async getAll(
        params: GetTransactionsParams = {},
    ): Promise<Transaction[]> {
        const res = await api.get(
            "/transactions",
            {
                params: clean(params),
            },
        );

        return unwrap<Transaction[]>(res);
    },

    async delete(id: string): Promise<void> {
        await api.delete(
            `/transactions/${id}`,
        );
    },

    async restore(id: string): Promise<void> {
        await api.post(
            `/transactions/${id}/restore`,
        );
    },

    async getById(
        id: string,
    ): Promise<Transaction> {
        const res = await api.get(
            `/transactions/${id}`,
        );

        return unwrap<Transaction>(res);
    },

    async update(
        id: string,
        payload: UpdateTransactionRequest,
    ): Promise<Transaction> {
        const res = await api.put(
            `/transactions/${id}`,
            clean(payload),
        );

        return unwrap<Transaction>(res);
    },
};

function clean<
    T extends Record<string, unknown>,
>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "",
        ),
    ) as Partial<T>;
}