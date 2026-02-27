import {api} from "./api";
import {CategoryTree} from "../types/category";
import {TransactionType} from "../types/transaction";

export const categoryService = {

    async getTree(): Promise<CategoryTree[]> {
        const res = await api.get("/categories");
        return res.data.data;
    },

    async getLeaf() {
        const res = await api.get("/categories/leaf");
        return res.data.data;
    },

    async createGroup(data: {
        name: string;
        type: TransactionType;
        children: string[];
    }) {
        const res = await api.post("/categories/bulk", data);
        return res.data.data;
    }
};