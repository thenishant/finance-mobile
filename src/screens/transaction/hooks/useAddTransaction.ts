import {useState} from "react";
import {useTransactionDraft} from "../../../stores/useTransactionDraft";
import {transactionService} from "../../../services/transaction.service";

export const useCreateTransaction = () => {
    const draft = useTransactionDraft();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        if (!draft.amount) return "Amount required";
        if (!draft.selectedAccount)
            return "Select account";

        if (
            draft.transactionType !== "TRANSFER" &&
            !draft.selectedCategory
        )
            return "Select category";

        if (
            draft.transactionType === "TRANSFER" &&
            !draft.selectedCategory &&
            !draft.selectedAccount
        )
            return "Invalid transfer";

        return null;
    };

    const submit = async () => {
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setError(null);
            setLoading(true);

            await transactionService.create({
                transactionType: draft.transactionType,
                paymentMethod: draft.paymentMethod,
                amount: Number(draft.amount),
                date: draft.date.toISOString(),
                categoryId:
                    draft.transactionType !== "TRANSFER"
                        ? draft.selectedCategory?.id
                        : undefined,
                fromAccountId: draft.selectedAccount?.id,
                toAccountId: undefined,
                note: draft.note,
            });

            draft.reset();
        } catch (err: any) {
            setError(
                err?.response?.data?.error?.message ||
                "Transaction failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        submit,
        loading,
        error,
    };
};