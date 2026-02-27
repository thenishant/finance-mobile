import { Button } from "../../components/ui";
import { FlatList } from "react-native";
import { Screen } from "../../components/ui/Screen";
import { useAccounts } from "../../hooks/useAccounts";
import { useTransactionDraft } from "../../stores/useTransactionDraft";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/AppStack";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export const SelectAccountScreen = () => {
    const navigation = useNavigation<Nav>();
    const draft = useTransactionDraft();
    const { data: accounts = [] } = useAccounts();

    return (
        <Screen>
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Button
                        title={`${item.name} (${item.type})`}
                        variant="ghost"
                        onPress={() => {
                            draft.setSelectedAccount(item);
                            navigation.goBack();
                        }}
                    />
                )}
                ListFooterComponent={
                    <Button
                        title="+ Add Account"
                        onPress={() => navigation.navigate("CreateAccount")}
                    />
                }
            />
        </Screen>
    );
};