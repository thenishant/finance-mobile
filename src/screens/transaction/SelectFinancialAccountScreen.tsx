import React from "react";
import {FlatList} from "react-native";
import {RouteProp, useNavigation, useRoute,} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Button} from "../../components/ui";
import {Screen} from "../../components/ui/Screen";
import {useAccounts} from "../../hooks/useAccounts";
import {useTransactionDraft} from "../../stores/useTransactionDraft";
import {AppStackParamList} from "../../navigation/AppStack";

type Nav = NativeStackNavigationProp<AppStackParamList, "SelectAccount">;
type Route = RouteProp<AppStackParamList, "SelectAccount">;

export const SelectAccountScreen = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const {mode} = route.params;
    const {setSourceAccount, setDestinationAccount,} = useTransactionDraft();
    const {data: accounts = []} = useAccounts();
    return (
        <Screen>
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Button
                        title={`${item.name} (${item.type})`}
                        variant="ghost"
                        onPress={() => {
                            if (mode === "source") {
                                setSourceAccount(item);
                            } else {
                                setDestinationAccount(item);
                            }
                            navigation.goBack();
                        }}
                    />
                )}
                ListFooterComponent={
                    <Button
                        title="+ Add Account"
                        onPress={() =>
                            navigation.navigate(
                                "CreateAccount"
                            )
                        }
                    />
                }
            />
        </Screen>
    );
};