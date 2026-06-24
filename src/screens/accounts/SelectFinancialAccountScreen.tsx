import React from "react";
import {FlatList, Pressable, StyleSheet, Text, View,} from "react-native";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Screen} from "../../components/ui/Screen";
import {Button} from "../../components/ui";
import {useAccounts} from "../../hooks/useAccounts";
import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {AppStackParamList} from "../../navigation/AppStack";
import {ACCOUNT_TYPE_OPTIONS,} from "../../types/financialAccount";

type Nav = NativeStackNavigationProp<AppStackParamList, "SelectAccount">;
type Route = RouteProp<AppStackParamList, "SelectAccount">;
const getLabel = (type: string) =>
    ACCOUNT_TYPE_OPTIONS.find(item => item.value === type)?.label ?? type;

export const SelectAccountScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const {mode} = route.params;
    const {sourceAccount, destinationAccount, setSourceAccount, setDestinationAccount,} = useTransactionDraft();
    const {data: accounts = []} = useAccounts();
    const selectedId = mode === "source" ? sourceAccount?.id : destinationAccount?.id;

    return (
        <Screen>
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={
                    styles.list
                }
                renderItem={({item}) => {
                    const selected =
                        item.id === selectedId;

                    return (
                        <Pressable
                            style={[styles.card, selected && styles.selected]}
                            onPress={() => {
                                if (mode === "source")
                                    setSourceAccount(item);
                                else
                                    setDestinationAccount(item);
                                navigation.goBack();
                            }}>
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.type}>{getLabel(item.type)}</Text>
                            </View>

                            <Text style={styles.balance}>₹{Number(item.balance).toLocaleString("en-IN")}</Text>
                        </Pressable>
                    );
                }}
                ListFooterComponent={
                    <Button title="Add Account"
                            onPress={() =>
                                navigation.navigate(
                                    "CreateAccount")}
                    />
                }
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: 24,
        gap: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    selected: {
        borderColor: "#111827",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    type: {
        marginTop: 2,
        fontSize: 13,
        color: "#6B7280",
    },
    balance: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },
});