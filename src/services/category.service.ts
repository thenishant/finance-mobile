import {api} from "./api";
import {unwrap} from "./base";
import {CategoryTree} from "../types/category";
import {TransactionType} from "../types/transaction";

export const categoryService = {

    async getTree(): Promise<CategoryTree[]> {
        const res = await api.get("/categories");
        return unwrap<CategoryTree[]>(res);
    },

    async getLeaf() {
        const res = await api.get("/categories/leaf");
        return unwrap(res);
    },

    async createGroup(data: {
        name: string;
        type: TransactionType;
        children: string[];
    }) {
        const res = await api.post("/categories/bulk", {
            name: data.name,
            type: data.type,
            children: data.children ?? [],
        });

        return unwrap(res);
    }
};