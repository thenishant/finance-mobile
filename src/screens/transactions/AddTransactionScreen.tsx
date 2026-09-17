import React, {useEffect, useState} from "react";
import {Alert, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {Calendar} from "react-native-calendars";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {Screen} from "../../components/common/ui/Screen";
import {Button, Input} from "../../components/common/ui";
import {AmountInput} from "../../components/common/ui/AmountInput";
import {TransactionTypeSection} from "../../components/common/transactions/TransactionTypeSection";

import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useCreateTransaction} from "../../hooks/useCreateTransaction";
import {AppStackParamList} from "../../navigation/AppStack";
import {transactionColors} from "../../design/transactionColors";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService, UpdateTransactionRequest} from "../../services/transaction.service";
import {Transaction, TRANSACTION_TYPES_LABELS} from "../../types/transaction";
import {colors} from "../../design";

type Nav = NativeStackNavigationProp<AppStackParamList>;

type AddTransactionRoute = RouteProp<AppStackParamList, "AddTransaction">;

const AddTransactionScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<AddTransactionRoute>();
    const queryClient = useQueryClient();

    const isEdit = route.params?.mode === "edit";
    const transactionId = route.params?.transactionId;

    const mutation = useCreateTransaction();

    const updateMutation = useMutation<Transaction, Error, UpdateTransactionRequest>({
        mutationFn: (payload) =>
            transactionService.update(
                transactionId!,
                payload
            ),

        onSuccess: async () => {
            reset();
            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            navigation.goBack();
        },
    });

    const transactionType = useTransactionDraft((s) => s.transactionType);
    const setTransactionType = useTransactionDraft((s) => s.setTransactionType);

    const amount = useTransactionDraft((s) => s.amount);
    const setAmount = useTransactionDraft((s) => s.setAmount);

    const note = useTransactionDraft((s) => s.note);
    const setNote = useTransactionDraft((s) => s.setNote);
    const sourceAccount = useTransactionDraft((s) => s.sourceAccount);
    const destinationAccount = useTransactionDraft((s) => s.destinationAccount);

    const selectedCategory = useTransactionDraft((s) => s.selectedCategory);
    const setSelectedCategory = useTransactionDraft((s) => s.setSelectedCategory);
    const setSourceAccount = useTransactionDraft((s) => s.setSourceAccount);
    const setDestinationAccount = useTransactionDraft((s) => s.setDestinationAccount);
    const date = useTransactionDraft((s) => s.date);
    const setDate = useTransactionDraft((s) => s.setDate);
    const reset = useTransactionDraft((s) => s.reset);

    const {data: transaction, isLoading} = useQuery<Transaction>({
        queryKey: ["transaction", transactionId],
        queryFn: () => transactionService.getById(transactionId!),
        enabled: isEdit && !!transactionId,
    });

    const theme = transactionColors[transactionType];
    const [calendarVisible, setCalendarVisible] = useState(false);
    const displayDate = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
    const formatBalance = (balance?: string | number) => {
        if (balance == null) return undefined;
        return `₹${Number(balance).toLocaleString("en-IN")}`;
    };
    useEffect(() => {
        return () => {
            if (!isEdit) {
                reset();
            }
        };
    }, [isEdit, reset]);

    useEffect(() => {
        if (!transaction) return;
        setTransactionType(transaction.type);
        setAmount(String(transaction.amount));
        setNote(transaction.note ?? "");
        setDate(new Date(transaction.date));
        if (transaction.category) {
            setSelectedCategory(transaction.category);
        }
        if (transaction.sourceAccount) {
            setSourceAccount(transaction.sourceAccount);
        }
        if (transaction.destinationAccount) {
            setDestinationAccount(transaction.destinationAccount);
        }
    }, [
        transaction,
        setTransactionType,
        setAmount,
        setNote,
        setDate,
        setSelectedCategory,
        setSourceAccount,
        setDestinationAccount,
    ]);

    const saveTransaction = (
        amt: number,
        updateMerchantMapping = false
    ) => {
        const payload: UpdateTransactionRequest = {
            type: transactionType,
            amount: amt,
            date: date.toISOString(),
            note: note || undefined,
            categoryId:
                transactionType === TRANSACTION_TYPES_LABELS[2].value
                    ? undefined
                    : selectedCategory?.id,
            sourceAccountId:
                transactionType === TRANSACTION_TYPES_LABELS[1].value
                    ? undefined
                    : sourceAccount?.id,
            destinationAccountId:
                transactionType === TRANSACTION_TYPES_LABELS[1].value
                    ? sourceAccount?.id
                    : transactionType === TRANSACTION_TYPES_LABELS[2].value
                        ? destinationAccount?.id
                        : undefined,
            updateMerchantMapping,
        };

        if (isEdit) {
            updateMutation.mutate(payload);
        } else {
            mutation.mutate(payload, {
                onSuccess: async () => {
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ["transactions"],
                    });
                    navigation.goBack();
                },
            });
        }
    };

    const handleSubmit = () => {
        const amt = Number(amount);

        if (!amt || amt <= 0) {
            Alert.alert("Enter valid amount");
            return;
        }

        if (transactionType === TRANSACTION_TYPES_LABELS[2].value) {
            if (!sourceAccount || !destinationAccount) {
                Alert.alert(
                    "Select source and destination accounts"
                );
                return;
            }

            if (sourceAccount.id === destinationAccount.id) {
                Alert.alert(
                    "Cannot transfer to same account"
                );
                return;
            }
        } else {
            if (!sourceAccount) {
                Alert.alert("Select account");
                return;
            }

            if (!selectedCategory) {
                Alert.alert("Select category");
                return;
            }
        }

        if (!isEdit) {
            saveTransaction(amt);
            return;
        }

        const categoryChanged =
            transaction?.category?.id !==
            selectedCategory?.id;

        const shouldAskToLearn =
            categoryChanged &&
            !!transaction?.merchant &&
            transaction.type !==
            TRANSACTION_TYPES_LABELS[2].value;

        if (!shouldAskToLearn) {
            saveTransaction(amt);
            return;
        }

        Alert.alert(
            "Remember this merchant?",
            `Future transactions from "${transaction?.merchant?.name}" will automatically be categorized as "${selectedCategory!.name}".`,
            [
                {
                    text: "Not now",
                    style: "cancel",
                    onPress: () =>
                        saveTransaction(amt, false),
                },
                {
                    text: "Remember",
                    onPress: () =>
                        saveTransaction(amt, true),
                },
            ]
        );
    };

    if (isEdit && isLoading) {
        return (
            <Screen>
                <View style={styles.loadingContainer}>
                    <Text style={styles.rowLabel}>Loading transaction...</Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <View style={styles.amountSection}>
                    <AmountInput
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                <View style={styles.card}>
                    <View style={styles.typeSection}>
                        <TransactionTypeSection
                            value={transactionType}
                            onChange={setTransactionType}
                        />
                    </View>

                    {transactionType !== TRANSACTION_TYPES_LABELS[2].value && (
                        <Row
                            label="Category"
                            value={
                                selectedCategory?.name ??
                                "Select"
                            }
                            onPress={() =>
                                navigation.navigate(
                                    "SelectCategory",
                                    {
                                        type: transactionType,
                                    }
                                )
                            }
                        />
                    )}

                    {transactionType === TRANSACTION_TYPES_LABELS[2].value ? (
                        <>
                            <Row
                                label="From Account"
                                value={
                                    sourceAccount?.name ??
                                    "Select"
                                }
                                subValue={formatBalance(sourceAccount?.balance)}
                                onPress={() =>
                                    navigation.navigate(
                                        "SelectAccount",
                                        {
                                            mode: "source",
                                        }
                                    )
                                }
                            />

                            <Row
                                label="To Account"
                                value={destinationAccount?.name ?? "Select"}
                                subValue={formatBalance(destinationAccount?.balance)}
                                onPress={() =>
                                    navigation.navigate(
                                        "SelectAccount", {
                                            mode: "destination"
                                        }
                                    )
                                }
                            />
                        </>
                    ) : (
                        <Row
                            label={
                                transactionType === TRANSACTION_TYPES_LABELS[1].value
                                    ? "Destination Account"
                                    : "Source Account"
                            }
                            value={sourceAccount?.name ?? "Select"}
                            subValue={formatBalance(sourceAccount?.balance)}
                            onPress={() =>
                                navigation.navigate(
                                    "SelectAccount",
                                    {
                                        mode: "source",
                                    }
                                )
                            }
                        />
                    )}

                    <Row
                        label="Date"
                        value={displayDate}
                        onPress={() =>
                            setCalendarVisible(true)
                        }
                    />
                </View>

                <Input
                    placeholder="Add note..."
                    value={note}
                    onChangeText={setNote}
                />

                {(mutation.error || updateMutation.error) && (
                    <Text style={styles.error}>
                        {mutation.error?.message ?? updateMutation.error?.message}
                    </Text>
                )}
            </KeyboardAwareScrollView>

            <View style={styles.footer}>
                <Button
                    title={
                        mutation.isPending || updateMutation.isPending
                            ? "Saving..."
                            : isEdit
                                ? "Save Changes"
                                : "Save Transaction"
                    }
                    onPress={handleSubmit}
                    disabled={
                        mutation.isPending || updateMutation.isPending
                    }
                    style={{
                        height: 50,
                        borderRadius: 14,
                        backgroundColor: theme.primary,
                    }}
                />
            </View>

            <Modal transparent animationType="fade" visible={calendarVisible}>
                <Pressable
                    style={styles.overlay}
                    onPress={() => setCalendarVisible(false)}
                />

                <View style={styles.calendarWrapper}>
                    <View style={styles.sheet}>
                        <Calendar
                            current={date.toISOString().split("T")[0]}
                            onDayPress={(day) => {
                                setDate(new Date(day.dateString));
                                setCalendarVisible(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

export default AddTransactionScreen;

type RowProps = {
    label: string;
    value: string;
    subValue?: string;
    onPress: () => void;
};

const Row = ({
                 label,
                 value,
                 subValue,
                 onPress,
             }: RowProps) => {
    return (
        <Pressable
            style={styles.row}
            onPress={onPress}
        >
            <View>
                <Text style={styles.rowLabel}>{label}</Text>
                {subValue && (
                    <Text style={styles.rowSub}>
                        {subValue}
                    </Text>
                )}
            </View>

            <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{value}</Text>
                <Text style={styles.chevron}>›</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 32,
        paddingBottom: 110,
        gap: 12,
    },
    amountSection: {
        alignItems: "center",
        borderRadius: 28,
        backgroundColor: colors.darkGrey,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 8,
    },
    card: {
        overflow: "hidden",
        backgroundColor: colors.darkGrey,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.border,
    },
    typeSection: {
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.white,
    },
    rowValue: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white,
    },
    rowSub: {
        marginTop: 2,
        fontSize: 12,
        color: colors.grey,
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    chevron: {
        fontSize: 16,
        color: colors.white,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 32,
        paddingTop: 12,
        paddingBottom: 24,
        backgroundColor: colors.darkBackground,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
    error: {
        color: colors.red,
        fontSize: 13,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
    },
    calendarWrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    sheet: {
        backgroundColor: colors.darkGrey,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 24,
    },
});