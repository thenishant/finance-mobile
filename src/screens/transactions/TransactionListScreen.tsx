import React, {useState} from "react";

import {useNavigation} from "@react-navigation/native";

import {TransactionFilters, TransactionSortBy,} from "../../services/transaction.service";

import {useGroupedTransactions} from "../../hooks/useGroupedTransactions";
import {useTransactions} from "../../hooks/useTransctions";

import {Transaction, TRANSACTION_TYPES_LABELS, TransactionType,} from "../../types/transaction";

import {TransactionList} from "./components/TransactionsList";

import BottomSheet from "../../components/common/BottomSheet";

import {AppScreen, ScreenHeader} from "../../ui";

import {TransactionFilterSection} from "./components/TransactionFilterSection";
import {TransactionSortSection} from "./components/TransactionSortSection";

import {SortOption} from "../../components/common/ui";

import {financeIcons} from "../../design/icons";

import {useMonthStore} from "../../stores/useMonthStore";
import MonthSelector from "../../components/common/ui/MonthSelector";

type Sheet = "filter" | "sort" | null;

const transactionTypeIcons: Record<
    TransactionType,
    keyof typeof financeIcons
> = {
    EXPENSE: "expense",
    INCOME: "income",
    TRANSFER: "transfer",
    INVESTMENT: "investment",
};

const TransactionListScreen = () => {
    const navigation = useNavigation<any>();

    const {
        year,
        month,
        prevMonth,
        nextMonth,
    } = useMonthStore();

    const [sheet, setSheet] =
        useState<Sheet>(null);

    const [sortBy, setSortBy] =
        useState<TransactionSortBy>("date");

    const [filters, setFilters] =
        useState<TransactionFilters>({});

    const [pendingFilters, setPendingFilters] =
        useState<TransactionFilters>({});

    const [refreshing, setRefreshing] =
        useState(false);

    const {
        transactions,
        isLoading,
        refresh,
        deleteTransaction,
    } = useTransactions({
        year,
        month,
        sortBy,
        filters,
    });

    const grouped = useGroupedTransactions(
        transactions,
        sortBy,
    );

    const hasFilter = Boolean(filters.type);

    const filterLabel = filters.type
        ? TRANSACTION_TYPES_LABELS.find(
        option =>
            option.value === filters.type,
    )?.label ?? "All"
        : "All";

    const sortLabels: Record<TransactionSortBy, string> = {
        date: "Transaction date",
        createdAt: "Date added",
        amount: "Amount",
        merchant: "Merchant",
        category: "Category",
    };

    const sortLabel = sortLabels[sortBy];

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await refresh();
        } finally {
            setRefreshing(false);
        }
    };

    const handleTransactionPress = (
        transaction: Transaction,
    ) => {
        navigation.navigate(
            "TransactionDetail",
            {
                transactionId: transaction.id,
            },
        );
    };

    const openFilter = () => {
        setPendingFilters(filters);
        setSheet("filter");
    };

    const openSort = () => {
        setSheet("sort");
    };

    const applyFilters = () => {
        setFilters(pendingFilters);
        setSheet(null);
    };

    const resetFilters = () => {
        setPendingFilters({});
    };

    const selectSort = (
        value: TransactionSortBy,
    ) => {
        setSortBy(value);
        setSheet(null);
    };

    const transactionTypeFilter = {
        title: "TRANSACTION TYPE",

        options: [
            {
                label: "All",
                selected: !pendingFilters.type,

                onPress: () =>
                    setPendingFilters(
                        current => ({
                            ...current,
                            type: undefined,
                        }),
                    ),
            },

            ...TRANSACTION_TYPES_LABELS.map(
                option => ({
                    label: option.label,

                    selected:
                        pendingFilters.type ===
                        option.value,

                    icon: financeIcons[
                        transactionTypeIcons[
                            option.value
                            ]
                        ],

                    onPress: () =>
                        setPendingFilters(
                            current => ({
                                ...current,
                                type:
                                    current.type ===
                                    option.value
                                        ? undefined
                                        : option.value,
                            }),
                        ),
                }),
            ),
        ],
    };

    const controls = [
        {
            label: "FILTER",
            value: filterLabel,
            icon: "options-outline" as const,
            onPress: openFilter,
            active: hasFilter,
        },
        {
            label: "SORT BY",
            value: sortLabel,
            icon: "swap-vertical-outline" as const,
            onPress: openSort,
        },
    ];

    return (
        <AppScreen>
            <ScreenHeader title="Transactions"/>

            <MonthSelector
                year={year}
                month={month}
                onPrevious={prevMonth}
                onNext={nextMonth}
            />

            <TransactionList
                data={grouped}
                isLoading={isLoading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onDelete={deleteTransaction}
                onPress={handleTransactionPress}
                controls={controls}
            />

            <BottomSheet
                visible={sheet === "filter"}
                title="Filters"
                onClose={() =>
                    setSheet(null)
                }
            >
                <TransactionFilterSection
                    filter={transactionTypeFilter}
                    onReset={resetFilters}
                    onApply={applyFilters}
                />
            </BottomSheet>

            <BottomSheet
                visible={sheet === "sort"}
                title="Sort By"
                onClose={() =>
                    setSheet(null)
                }
            >
                <TransactionSortSection>
                    <SortOption
                        title="Transaction date"
                        subtitle="When the transaction happened"
                        selected={sortBy === "date"}
                        onPress={() => selectSort("date")}
                    />

                    <SortOption
                        title="Date added"
                        subtitle="When the transaction was recorded"
                        selected={sortBy === "createdAt"}
                        onPress={() => selectSort("createdAt")}
                    />

                    <SortOption
                        title="Amount"
                        subtitle="Sort by transaction amount"
                        selected={sortBy === "amount"}
                        onPress={() => selectSort("amount")}
                    />
                </TransactionSortSection>
            </BottomSheet>
        </AppScreen>
    );
};

export default TransactionListScreen;