import {TransactionType} from "./transaction";

export interface CategoryTree {
    id: string;
    name: string;
    type: TransactionType;
    parentId: string | null;
    children: CategoryTree[];
}

export interface LeafCategory {
    id: string;
    name: string;
    type: TransactionType;
    parentId: string | null;
    parent?: {
        id: string;
        name: string;
    } | null;
}