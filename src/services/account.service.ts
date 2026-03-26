import {api} from "./api";
import {AccountType} from "../types/account";
import {normalizeAmount, unwrap} from "./base";

export interface Account {
    id: string;
    name: string;
    type: AccountType;

    // 🔥 Decimal-safe
    balance: string;
}

type CreateAccountPayload = {
    name: string;
    balance: string | number;
    type: AccountType;
};

export const accountService = {

    async getAll(): Promise<Account[]> {
        const res = await api.get("/accounts");
        return unwrap<Account[]>(res);
    },

    async create(data: CreateAccountPayload): Promise<Account> {
        const res = await api.post("/accounts", {
            ...data,
            balance: normalizeAmount(data.balance),
        });

        return unwrap<Account>(res);
    },

    async update(id: string, data: Partial<CreateAccountPayload>) {
        const res = await api.patch(`/accounts/${id}`, data);
        return unwrap<Account>(res);
    },

    async delete(id: string) {
        await api.delete(`/accounts/${id}`);
    }
};