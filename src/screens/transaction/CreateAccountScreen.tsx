import React, {useState} from "react";
import {Screen} from "../../components/ui/Screen";
import {Button, Input, PillGroup} from "../../components/ui";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import {AppStackParamList} from "../../navigation/AppStack";
import {accountService} from "../../services/account.service";
import {ACCOUNT_TYPES, AccountType} from "../../types/account";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const CreateAccountScreen = () => {
    const navigation = useNavigation<Nav>();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [type, setType] = useState<AccountType>("SAVING");

    const mutation = useMutation({
        mutationFn: accountService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            navigation.goBack();
        },
    });

    return (
        <Screen>
            <Input
                placeholder="Account Name"
                value={name}
                onChangeText={setName}
            />

            <Input
                placeholder="Initial Balance"
                keyboardType="numeric"
                value={initialBalance}
                onChangeText={setInitialBalance}
            />

            <PillGroup
                data={ACCOUNT_TYPES}
                value={type}
                onChange={setType}
            />

            <Button
                title={mutation.isPending ? "Saving..." : "Save"}
                onPress={() =>
                    mutation.mutate({
                        name,
                        type,
                        initialBalance: Number(initialBalance || 0),
                    })
                }
                disabled={mutation.isPending}
            />
        </Screen>
    );
};