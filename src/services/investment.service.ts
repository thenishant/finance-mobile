import {api} from "./api";
import {unwrap} from "./base";

export const investmentService = {
    async setGoal(data: {
        year: number;
        month: number;
        goalPercent: number;
    }) {
        const res = await api.post("/investment/goal", data);
        return unwrap(res);
    }
};