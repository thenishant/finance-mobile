import React, {useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {Screen} from "../../components/ui/Screen";
import {Button, Input, PillGroup} from "../../components/ui";

import {AppStackParamList} from "../../navigation/AppStack";

import {
    ACCOUNT_TYPE_OPTIONS,
    FinancialAccountType,
} from "../../types/financialAccount";

import {financialAccountService} from "../../services/account.service";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const CreateAccountScreen = () => {
    const navigation = useNavigation<Nav>();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [balance, setBalance] =
        useState("");
    const [last4, setLast4] = useState("");

    const [type, setType] =
        useState<FinancialAccountType>(
            "BANK_ACCOUNT"
        );

    const mutation = useMutation({
        mutationFn: financialAccountService.create,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["financial-accounts"],
            });

            navigation.goBack();
        },
    });

    const handleSave = () => {
        if (!name.trim() || last4.trim().length !== 4) {
            return;
        }

        mutation.mutate({
            name: name.trim(),
            type,
            last4: last4.trim(),
            currentBalance: Number(balance || 0),
        });
    };

    return (
        <Screen>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={styles.card}>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Account Type
                        </Text>

                        <PillGroup
                            variant="grid"
                            data={ACCOUNT_TYPE_OPTIONS}
                            value={type}
                            onChange={setType}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>
                            Account Name
                        </Text>

                        <Input
                            placeholder="e.g. HDFC Salary Account"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Current Balance
                            </Text>

                            <Input
                                placeholder="0"
                                keyboardType="numeric"
                                value={balance}
                                onChangeText={setBalance}
                            />
                        </View>

                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Last 4 Digits
                            </Text>

                            <Input
                                placeholder="1234"
                                keyboardType="number-pad"
                                value={last4}
                                onChangeText={(text) =>
                                    setLast4(
                                        text.replace(/\D/g, "").slice(0, 4)
                                    )
                                }
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button
                        title={
                            mutation.isPending
                                ? "Creating..."
                                : "Create Account"
                        }
                        onPress={handleSave}
                        disabled={
                            mutation.isPending ||
                            !name.trim() ||
                            last4.trim().length !== 4
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    label: {
        marginBottom: 6,
    },
    input: {
        marginBottom: 14,
    },
    sectionTitle: {
        marginTop: 12,
        marginBottom: 10,
    },
    footer: {
        marginTop: 20,
    }, card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 16,
        gap: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    half: {
        flex: 1,
    },
    section: {
        marginTop: 20,
    }
});