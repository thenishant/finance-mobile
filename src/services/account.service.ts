import {api} from "./api";
import {unwrap} from "./base";
import {FinancialAccountType} from "../types/financialAccount";
import {FinancialAccount} from "../types/api.types";

export type CreateFinancialAccountPayload = {
    name: string;
    nickname?: string;
    type: FinancialAccountType;
    provider?: string;
    institutionName?: string;
    last4?: string;
    currentBalance?: number;
    availableBalance?: number;
    creditLimit?: number;
};

export const financialAccountService = {
    async getAll(): Promise<FinancialAccount[]> {
        const res = await api.get("/financial-accounts");
        return unwrap<FinancialAccount[]>(res);
    },

    async create(
        data: CreateFinancialAccountPayload
    ): Promise<FinancialAccount> {
        const res = await api.post(
            "/financial-accounts",
            data
        );

        return unwrap<FinancialAccount>(res);
    },

    async update(
        id: string,
        data: Partial<CreateFinancialAccountPayload>
    ): Promise<FinancialAccount> {
        const res = await api.patch(
            `/financial-accounts/${id}`,
            data
        );

        return unwrap<FinancialAccount>(res);
    },

    async delete(id: string) {
        await api.delete(
            `/financial-accounts/${id}`
        );
    },

    async archive(id: string) {
        await api.post(
            `/financial-accounts/${id}/archive`
        );
    },
};