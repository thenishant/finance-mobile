import {create} from "zustand";
import {Account} from "../types/api.types";
import {LeafCategory} from "../types/category";
import {TransactionType} from "../types/transaction";
import {PaymentMethod} from "../types/payment";

type TransactionDraft = {
    transactionType: TransactionType;
    amount: string;
    note: string;
    paymentMethod: PaymentMethod;
    date: Date;
    selectedAccount: Account | null;
    selectedToAccount: Account | null;
    selectedCategory: LeafCategory | null;
    setTransactionType: (v: TransactionType) => void;
    setAmount: (v: string) => void;
    setNote: (v: string) => void;
    setPaymentMethod: (v: PaymentMethod) => void;
    setDate: (v: Date) => void;
    setSelectedAccount: (v: Account | null) => void;
    setSelectedToAccount: (v: Account | null) => void;
    setSelectedCategory: (v: LeafCategory | null) => void;
    reset: () => void;
};

export const useTransactionDraft = create<TransactionDraft>((set) => ({
    transactionType: "EXPENSE",
    amount: "",
    note: "",
    paymentMethod: "CASH",
    date: new Date(),
    selectedAccount: null,
    selectedToAccount: null,
    selectedCategory: null,
    setTransactionType: (v) =>
        set((state) => {
            if (state.transactionType === "TRANSFER" && v !== "TRANSFER") {
                return {
                    transactionType: v,
                    selectedToAccount: null
                };
            }
            if (v === "TRANSFER") {
                return {
                    transactionType: v,
                    selectedCategory: null
                };
            }
            return {transactionType: v};
        }),
    setAmount: (v) => set({amount: v}),
    setNote: (v) => set({note: v}),
    setPaymentMethod: (v) => set({paymentMethod: v}),
    setDate: (v) => set({date: v}),
    setSelectedAccount: (v) => set({selectedAccount: v}),
    setSelectedToAccount: (v) => set({selectedToAccount: v}),
    setSelectedCategory: (v) => set({selectedCategory: v}),
    reset: () =>
        set({
            amount: "",
            note: "",
            selectedAccount: null,
            selectedToAccount: null,
            selectedCategory: null
        })
}));