import {api} from "./api";
import {AccountType} from "../types/account";

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
}

interface CreateAccountPayload {
    name: string;
    initialBalance: number;
    type: AccountType;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const accountService = {
    async getAll(): Promise<Account[]> {
        const res = await api.get<ApiResponse<Account[]>>("/accounts");
        return res.data.data;
    },

    async create(data: CreateAccountPayload): Promise<Account> {
        const res = await api.post<ApiResponse<Account>>("/accounts", data);
        return res.data.data;
    },
};