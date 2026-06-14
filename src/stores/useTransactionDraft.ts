import {create} from "zustand";
import {LeafCategory} from "../types/category";
import {TransactionType} from "../types/transaction";
import {FinancialAccount} from "../types/api.types";

type TransactionDraft = {
    transactionType: TransactionType;

    amount: string;
    note: string;
    date: Date;

    sourceAccount: FinancialAccount | null;
    destinationAccount: FinancialAccount | null;

    selectedCategory: LeafCategory | null;

    setTransactionType: (value: TransactionType) => void;
    setAmount: (value: string) => void;
    setNote: (value: string) => void;
    setDate: (value: Date) => void;
    setSourceAccount: (value: FinancialAccount | null) => void;
    setDestinationAccount: (value: FinancialAccount | null) => void;
    setSelectedCategory: (value: LeafCategory | null) => void;
    reset: () => void;
};

export const useTransactionDraft =
    create<TransactionDraft>((set) => ({
        transactionType: "EXPENSE",

        amount: "",
        note: "",
        date: new Date(),

        sourceAccount: null,
        destinationAccount: null,

        selectedCategory: null,

        setTransactionType: (transactionType) =>
            set({
                transactionType,

                destinationAccount:
                    transactionType === "TRANSFER"
                        ? null
                        : undefined,

                selectedCategory:
                    transactionType === "TRANSFER"
                        ? null
                        : undefined,
            }),

        setAmount: (amount) =>
            set({amount}),

        setNote: (note) =>
            set({note}),

        setDate: (date) =>
            set({date}),

        setSourceAccount: (sourceAccount) =>
            set({sourceAccount}),

        setDestinationAccount: (
            destinationAccount
        ) =>
            set({destinationAccount}),

        setSelectedCategory: (
            selectedCategory
        ) =>
            set({selectedCategory}),

        reset: () =>
            set({
                transactionType: "EXPENSE",

                amount: "",
                note: "",
                date: new Date(),

                sourceAccount: null,
                destinationAccount: null,

                selectedCategory: null,
            }),
    }));