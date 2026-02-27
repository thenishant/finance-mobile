import {ActivityIndicator, FlatList, RefreshControl, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useMemo, useState} from "react";
import {TransactionSnackbar} from "./components/TransactionSnackbar";
import {TransactionSection} from "./components/TransactionSection";
import {formatDateLabel} from "../../utils/date";
import {useUndoDelete} from "../../hooks/useUndoDelete";
import {transactionService} from "../../services/transaction.service";
import {Transaction} from "../../types/transaction";

const TransactionListScreen = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const res = await transactionService.getAll();
        setTransactions(res);
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const {deleteItem, undo, visible} =
        useUndoDelete(transactions, setTransactions, loadData);

    const groupedData = useMemo(() => {
        const grouped: Record<string, Transaction[]> = {};

        transactions.forEach(trx => {
            const label = formatDateLabel(trx.date);

            if (!grouped[label]) {
                grouped[label] = [];
            }

            grouped[label].push(trx);
        });

        return Object.entries(grouped).map(([date, list]) => ({
            date,
            transactions: list,
        }));
    }, [transactions]);

    if (loading) {
        return <ActivityIndicator/>;
    }

    const isEmpty = transactions.length === 0;

    return (
        <SafeAreaView style={{flex: 1, marginTop: 15}}>
            {isEmpty ? (
                <Text>No transactions yet</Text>
            ) : (
                <FlatList
                    data={groupedData}
                    keyExtractor={(item) => item.date}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={loadData}
                        />
                    }
                    renderItem={({item}) => (
                        <TransactionSection
                            date={item.date}
                            transactions={item.transactions.map(t => ({
                                id: t.id,
                                type: t.type,
                                amount: t.amount,
                                category: t.category?.name,
                                account: t.fromAccount?.name,
                            }))}
                            onDelete={deleteItem}
                        />
                    )}
                />
            )}

            <TransactionSnackbar
                visible={visible}
                onUndo={undo}
            />
        </SafeAreaView>
    );
};

export default TransactionListScreen;