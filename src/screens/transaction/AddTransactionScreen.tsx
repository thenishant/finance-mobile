import React, {memo, useEffect, useRef, useState} from "react";
import {Animated, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Calendar} from "react-native-calendars";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {Screen} from "../../components/ui/Screen";
import {Button, Input} from "../../components/ui";
import {AmountInput} from "../../components/ui/AmountInput";
import {TransactionTypeSection} from "../../components/features/transactions/TransactionTypeSection";
import {PaymentSection} from "../../components/features/transactions/PaymentSection";

import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {useCreateTransaction} from "../../hooks/useCreateTransaction";
import {AppStackParamList} from "../../navigation/AppStack";
import {transactionColors} from "../../design/transactionColors";

type Nav = NativeStackNavigationProp<AppStackParamList>;

const AddTransactionScreen = () => {
    const navigation = useNavigation<Nav>();
    const mutation = useCreateTransaction();

    /* =============================
       Zustand
    ============================== */

    const transactionType = useTransactionDraft(s => s.transactionType);
    const setTransactionType = useTransactionDraft(s => s.setTransactionType);

    const amount = useTransactionDraft(s => s.amount);
    const setAmount = useTransactionDraft(s => s.setAmount);

    const note = useTransactionDraft(s => s.note);
    const setNote = useTransactionDraft(s => s.setNote);

    const selectedAccount = useTransactionDraft(s => s.selectedAccount);
    const selectedCategory = useTransactionDraft(s => s.selectedCategory);

    const paymentMethod = useTransactionDraft(s => s.paymentMethod);
    const setPaymentMethod = useTransactionDraft(s => s.setPaymentMethod);

    const date = useTransactionDraft(s => s.date);
    const setDate = useTransactionDraft(s => s.setDate);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const reset = useTransactionDraft(s => s.reset);

    /* =============================
       Animation
    ============================== */

    const colorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(colorAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start(() => colorAnim.setValue(0));
    }, [transactionType]);

    const theme = transactionColors[transactionType];

    /* =============================
       Calendar
    ============================== */

    const [calendarVisible, setCalendarVisible] = useState(false);

    const displayDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    /* =============================
       Balance Logic
    ============================== */

    const numericAmount = Number(amount || 0);

    const remaining =
        selectedAccount && numericAmount
            ? selectedAccount.balance - numericAmount
            : null;

    /* =============================
       SUBMIT HANDLER (FINAL)
    ============================== */

    const handleSubmit = () => {
        if (isSubmitting) return; // ✅ HARD BLOCK

        const amt = Number(amount);

        if (!amt || amt <= 0) {
            alert("Enter valid amount");
            return;
        }

        if (!selectedAccount) {
            alert("Select account");
            return;
        }

        if (transactionType === "TRANSFER") {
            alert("Transfer not supported yet");
            return;
        }

        if (!selectedCategory) {
            alert("Select category");
            return;
        }

        setIsSubmitting(true); // 🔥 LOCK

        const payload = {
            type: transactionType,
            amount: amt,
            date: date.toISOString(),
            paymentMethod,
            note: note || undefined,
            categoryId: selectedCategory.id,
            ...(transactionType === "INCOME"
                ? {toAccountId: selectedAccount.id}
                : {fromAccountId: selectedAccount.id}),
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                reset();        // ✅ clear form
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false); // 🔓 UNLOCK
            },
        });
    };

    /* =============================
       UI
    ============================== */

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

                <TransactionTypeSection
                    value={transactionType}
                    onChange={setTransactionType}
                />

                <View style={styles.card}>
                    <Row
                        label="Account"
                        value={selectedAccount ? selectedAccount.name : "Select"}
                        subValue={
                            selectedAccount
                                ? remaining !== null
                                    ? `₹${selectedAccount.balance.toLocaleString()} → ₹${remaining.toLocaleString()}`
                                    : `₹${selectedAccount.balance.toLocaleString()}`
                                : undefined
                        }
                        onPress={() => navigation.navigate("SelectAccount")}
                    />

                    {transactionType !== "TRANSFER" && (
                        <Row
                            label="Category"
                            value={selectedCategory ? selectedCategory.name : "Select"}
                            onPress={() =>
                                navigation.navigate("SelectCategory", {
                                    type: transactionType,
                                })
                            }
                        />
                    )}

                    <Row
                        label="Date"
                        value={displayDate}
                        onPress={() => setCalendarVisible(true)}
                    />

                    <PaymentSection
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                    />
                </View>

                <Input
                    placeholder="Add note..."
                    value={note}
                    onChangeText={setNote}
                />

                {mutation.error && (
                    <Text style={styles.error}>
                        {mutation.error.message}
                    </Text>
                )}
            </KeyboardAwareScrollView>

            {/* Footer */}
            <Animated.View
                style={[
                    styles.footer,
                    {
                        transform: [
                            {scale: mutation.isPending ? 0.98 : 1},
                        ],
                    },
                ]}
            >
                <Button
                    title={mutation.isPending ? "Saving..." : "Save Transaction"}
                    onPress={handleSubmit}
                    disabled={mutation.isPending || isSubmitting}
                    style={{backgroundColor: theme.primary}}
                />
            </Animated.View>

            {/* Calendar */}
            <Modal transparent animationType="fade" visible={calendarVisible}>
                <Pressable
                    style={styles.overlay}
                    onPress={() => setCalendarVisible(false)}
                />

                <SafeAreaView style={styles.calendarWrapper}>
                    <View style={styles.sheet}>
                        <Calendar
                            current={date.toISOString().split("T")[0]}
                            onDayPress={(day) => {
                                setDate(new Date(day.dateString));
                                setCalendarVisible(false);
                            }}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </Screen>
    );
};

export default AddTransactionScreen;

/* =============================
   Row Component
============================= */

const Row = memo(
    ({
         label,
         value,
         subValue,
         onPress,
     }: {
        label: string;
        value: string;
        subValue?: string;
        onPress: () => void;
    }) => (
        <Pressable style={styles.row} onPress={onPress}>
            <Text style={styles.rowLabel}>{label}</Text>

            <View style={styles.right}>
                <Text style={styles.rowValue}>{value} ›</Text>
                {subValue && <Text style={styles.rowSub}>{subValue}</Text>}
            </View>
        </Pressable>
    )
);

/* =============================
   Styles
============================= */

const styles = StyleSheet.create({
    container: {
        paddingBottom: 120,
        gap: 24,
    },
    amountSection: {
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 8,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    rowLabel: {
        fontSize: 16,
        color: "#6B7280",
    },
    right: {
        alignItems: "flex-end",
    },
    rowValue: {
        fontSize: 16,
        fontWeight: "600",
    },
    rowSub: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    error: {
        color: "red",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    calendarWrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
    },
});