import React, {useRef, useState} from "react";
import {LayoutAnimation} from "react-native";
import {transactionService} from "../services/transaction.service";
import {Transaction} from "../types/transaction.types";

type ReloadFn = () => Promise<void> | void;

export const useUndoDelete = (
    data: Transaction[],
    setData: React.Dispatch<React.SetStateAction<Transaction[]>>,
    reload: ReloadFn
) => {
    const [recentlyDeleted, setRecentlyDeleted] =
        useState<Transaction | null>(null);

    const [visible, setVisible] = useState<boolean>(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const deleteItem = (id: string) => {
        const item = data.find(t => t.id === id);
        if (!item) return;

        LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
        );

        setData(prev => prev.filter(t => t.id !== id));
        setRecentlyDeleted(item);
        setVisible(true);

        timeoutRef.current = setTimeout(async () => {
            try {
                await transactionService.delete(id);
            } catch {
                reload();
            }

            setVisible(false);
            setRecentlyDeleted(null);
        }, 4000);
    };

    const undo = () => {
        if (!recentlyDeleted) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setData(prev => [recentlyDeleted, ...prev]);
        setRecentlyDeleted(null);
        setVisible(false);
    };

    return {deleteItem, undo, visible};
};