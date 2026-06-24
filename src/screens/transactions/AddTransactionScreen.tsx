import React, {useEffect, useState} from "react";
import {Alert, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {Calendar} from "react-native-calendars";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {Screen} from "../../components/ui/Screen";
import {Button, Input} from "../../components/ui";
import {AmountInput} from "../../components/ui/AmountInput";
import {TransactionTypeSection} from "../../components/transactions/TransactionTypeSection";

import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useCreateTransaction} from "../../hooks/useCreateTransaction";
import {AppStackParamList} from "../../navigation/AppStack";
import {transactionColors} from "../../design/transactionColors";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService, UpdateTransactionRequest} from "../../services/transaction.service";
import {Transaction} from "../../types/transaction";

type Nav = NativeStackNavigationProp<AppStackParamList>;

type AddTransactionRoute = RouteProp<
    AppStackParamList,
    "AddTransaction"
>;

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

    const handleSubmit = () => {
        const amt = Number(amount);
        if (!amt || amt <= 0) {
            Alert.alert("Enter valid amount");
            return;
        }
        if (transactionType === "TRANSFER") {
            if (!sourceAccount || !destinationAccount) {
                Alert.alert("Select source and destination accounts");
                return;
            }

            if (sourceAccount.id === destinationAccount.id) {
                Alert.alert("Cannot transfer to same account");
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

        const payload: UpdateTransactionRequest = {
            type: transactionType,
            amount: amt,
            date: date.toISOString(),
            note: note || undefined,
            categoryId:
                transactionType === "TRANSFER"
                    ? undefined
                    : selectedCategory?.id,
            sourceAccountId:
                transactionType === "INCOME"
                    ? undefined
                    : sourceAccount?.id,
            destinationAccountId:
                transactionType === "INCOME"
                    ? sourceAccount?.id
                    : transactionType === "TRANSFER"
                        ? destinationAccount?.id
                        : undefined,
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

                    {transactionType !== "TRANSFER" && (
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

                    {transactionType === "TRANSFER" ? (
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
                                        "SelectAccount",
                                        {
                                            mode: "destination",
                                        }
                                    )
                                }
                            />
                        </>
                    ) : (
                        <Row
                            label={
                                transactionType === "INCOME"
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
        paddingHorizontal: 8,
        paddingBottom: 90,
        gap: 8,
    },
    amountSection: {
        alignItems: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    typeSection: {
        padding: 8,
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
        paddingHorizontal: 16,
        paddingVertical: 22,
        borderBottomWidth: 1,
        borderBottomColor: "#F8FAFC",
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: "#6B7280",
    },
    rowValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    rowSub: {
        marginTop: 2,
        fontSize: 12,
        color: "#9CA3AF",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    chevron: {
        fontSize: 16,
        color: "#D1D5DB",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "rgba(255,255,255,0.98)",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    error: {
        color: "#DC2626",
        fontSize: 13,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    calendarWrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 24,
    },
});