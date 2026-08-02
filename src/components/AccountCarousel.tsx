import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import {DashboardAccount} from "../types/dashboard";
import {AppText} from "./common";
import {colors, spacing} from "../design";
import CompactAccountCard from "./AccountCard";



type Props = {
    accounts: DashboardAccount[];
    onAccountPress?: (
        account: DashboardAccount
    ) => void;
    onSeeAllPress?: () => void;
};

export default function AccountsSection({
                                            accounts,
                                            onAccountPress,
                                            onSeeAllPress,
                                        }: Props) {
    if (!accounts.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText
                    variant="heading"
                    weight="700"
                >
                    Accounts
                </AppText>

                {onSeeAllPress && (
                    <Pressable
                        onPress={onSeeAllPress}
                        hitSlop={8}
                    >
                        <AppText
                            variant="caption"
                            weight="600"
                            color={colors.primary}
                        >
                            See All
                        </AppText>
                    </Pressable>
                )}
            </View>

            <FlatList
                horizontal
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <CompactAccountCard
                        account={item}
                        onPress={onAccountPress}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            width: spacing.sm,
                        }}
                    />
                )}
                showsHorizontalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.listContent
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.lg,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },

    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xs,
    },
});