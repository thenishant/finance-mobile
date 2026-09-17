import React, {useMemo, useState} from "react";

import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

import {useNavigation} from "@react-navigation/native";

import {TransactionFilters, transactionService, TransactionSortBy,} from "../../services/transaction.service";

import {useGroupedTransactions} from "../../hooks/useGroupedTransactions";

import {Transaction, TRANSACTION_TYPES_LABELS, TransactionType,} from "../../types/transaction";

import {TransactionList} from "./components/TransactionsList";

import BottomSheet from "../../components/common/BottomSheet";

import {AppScreen, ScreenHeader} from "../../ui";

import {TransactionFilterSection} from "./components/TransactionFilterSection";
import {TransactionSortSection} from "./components/TransactionSortSection";

import {SortOption} from "../../components/common/ui";

import {financeIcons} from "../../design/icons";

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
    const queryClient = useQueryClient();
    const navigation = useNavigation<any>();

    const [sheet, setSheet] = useState<Sheet>(null);

    const [sortBy, setSortBy] =
        useState<TransactionSortBy>("date");

    const [filters, setFilters] =
        useState<TransactionFilters>({});

    const [pendingFilters, setPendingFilters] =
        useState<TransactionFilters>({});

    const {
        data: transactions = [],
        isLoading,
        refetch,
        isRefetching,
    } = useQuery<Transaction[]>({
        queryKey: [
            "transactions",
            sortBy,
            filters,
        ],

        queryFn: () =>
            transactionService.getAll({
                sortBy,
                order: "desc",
                ...filters,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            transactionService.delete(id),

        onMutate: async id => {
            await queryClient.cancelQueries({
                queryKey: ["transactions"],
            });

            const queryKey = [
                "transactions",
                sortBy,
                filters,
            ];

            const previous =
                queryClient.getQueryData<Transaction[]>(
                    queryKey,
                );

            queryClient.setQueryData<Transaction[]>(
                queryKey,
                (old = []) =>
                    old.filter(
                        transaction =>
                            transaction.id !== id,
                    ),
            );

            return {previous};
        },

        onError: (
            _error,
            _id,
            context,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    [
                        "transactions",
                        sortBy,
                        filters,
                    ],
                    context.previous,
                );
            }
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["transactions"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["dashboard"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["analytics"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["accounts"],
                }),
            ]);
        },
    });

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

    const grouped = useGroupedTransactions(
        transactions,
        sortBy,
    );

    const hasFilters =
        Object.keys(filters).length > 0;

    const filterLabel =
        filters.type
            ? filters.type.charAt(0) +
            filters.type.slice(1).toLowerCase()
            : filters.accountType
                ? filters.accountType
                    .replace("_", " ")
                    .toLowerCase()
                    .replace(
                        /\b\w/g,
                        char => char.toUpperCase(),
                    )
                : "All";

    const sortLabel =
        sortBy === "date"
            ? "Transaction date"
            : "Date added";

    const controls = [
        {
            label: "FILTER",
            value: filterLabel,
            icon: "options-outline" as const,
            onPress: openFilter,
            active: hasFilters,
        },
        {
            label: "SORT BY",
            value: sortLabel,
            icon: "swap-vertical-outline" as const,
            onPress: openSort,
        },
    ];

    /*
     * Filter definitions.
     *
     * All filter logic lives here.
     * TransactionFilterSection only renders the filter.
     */
    const transactionTypeFilter = useMemo(
        () => ({
            title: "TRANSACTION TYPE",

            options: [
                {
                    label: "All",
                    selected: !pendingFilters.type,
                    onPress: () =>
                        setPendingFilters(current => ({
                            ...current,
                            type: undefined,
                        })),
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
        }),
        [pendingFilters.type],
    );

    return (
        <AppScreen>
            <ScreenHeader title="Transactions"/>

            <TransactionList
                data={grouped}
                isLoading={isLoading}
                refreshing={isRefetching}
                onRefresh={refetch}
                onDelete={id => deleteMutation.mutate(id)}
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
                        selected={
                            sortBy === "date"
                        }
                        onPress={() =>
                            selectSort("date")
                        }
                    />

                    <SortOption
                        title="Date added"
                        subtitle="When the transaction was recorded"
                        selected={sortBy === "createdAt"}
                        onPress={() => selectSort("createdAt")}
                    />
                </TransactionSortSection>
            </BottomSheet>
        </AppScreen>
    );
};

export default TransactionListScreen;