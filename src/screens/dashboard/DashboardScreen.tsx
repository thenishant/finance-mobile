import React from "react";
import {Pressable, ScrollView, StyleSheet, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useMonthStore} from "../../stores/useMonthStore";
import {useDashboard} from "../../hooks/useDashboard";
import {AppScreen} from "../../ui";
import {Body, Heading} from "../../components/typography";
import {Spacer} from "../../components";
import HeroCard from "../../components/premium/HeroCardV2";
import AccountsSection from "../../components/dashboard/AccountsSection";
import ActivitySection from "../../components/dashboard/ActivitySection";
import MonthSelector from "../../components/common/ui/MonthSelector";
import {colors, radius, spacing} from "../../design";
import StatsSection from "../../components/dashboard/StatsSection";
import {AppStackParamList} from "../../navigation/AppStack";

const SettingsButton = React.memo(
    function SettingsButton() {
        const navigation =
            useNavigation<
                NativeStackNavigationProp<AppStackParamList>
            >();

        return (
            <Pressable
                onPress={() =>
                    navigation.navigate("AccountSettings")
                }
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Account settings"
                style={({pressed}) => [
                    styles.settingsButton,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name="settings-outline"
                    size={20}
                    color={colors.text}
                />
            </Pressable>
        );
    },
);

const MonthSelectorContainer = React.memo(
    function MonthSelectorContainer() {
        const year = useMonthStore((state) => state.year);
        const month = useMonthStore((state) => state.month);
        const prevMonth = useMonthStore((state) => state.prevMonth);
        const nextMonth = useMonthStore((state) => state.nextMonth);

        return (
            <View style={styles.monthSelector}>
                <MonthSelector
                    year={year}
                    month={month}
                    onPrevious={prevMonth}
                    onNext={nextMonth}
                />
            </View>
        );
    },
);

const TopBar = () => (
    <View style={styles.topBar}>
        <MonthSelectorContainer/>
        <SettingsButton/>
    </View>
);

export default function DashboardScreen() {
    const navigation =
        useNavigation<
            NativeStackNavigationProp<AppStackParamList>
        >();

    const year = useMonthStore((state) => state.year);
    const month = useMonthStore((state) => state.month);
    const {data, isLoading, error} = useDashboard(year, month);

    if (isLoading && !data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.container}>
                    <TopBar/>
                    <View style={styles.center}>
                        <Body>Loading...</Body>
                    </View>
                </View>
            </AppScreen>
        );
    }

    if (error && !data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.container}>
                    <TopBar/>
                    <View style={styles.center}>
                        <Heading>Something went wrong</Heading>
                        <Spacer size="sm"/>
                        <Body>Unable to load your dashboard.</Body>
                    </View>
                </View>
            </AppScreen>
        );
    }

    if (!data) {
        return (
            <AppScreen keyboard={false}>
                <View style={styles.container}>
                    <TopBar/>
                    <View style={styles.center}>
                        <Body>No dashboard data available.</Body>
                    </View>
                </View>
            </AppScreen>
        );
    }

    const {summary, comparison, accounts, recentTransactions} = data;

    return (
        <AppScreen keyboard={false}>
            <View style={styles.container}>
                <TopBar/>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <HeroCard
                        balance={summary.totalBalance}
                        change={comparison.change.savings.percent ?? 0}
                        changeLabel="This Month"
                    />
                    <Spacer size="md"/>
                    <StatsSection
                        stats={[
                            {
                                title: "Income",
                                value: summary.monthlyIncome,
                                change: comparison.change.income.percent ?? 0,
                                type: "income",
                            },
                            {
                                title: "Expenses",
                                value: summary.monthlyExpense,
                                change: comparison.change.expense.percent ?? 0,
                                type: "expense",
                            },
                            {
                                title: "Investments",
                                value: summary.monthlyInvestment,
                                change: comparison.change.investment.percent ?? 0,
                                type: "investment",
                                onPress: () =>
                                    navigation.navigate("Investment"),
                            },
                            {
                                title: "Savings",
                                value: summary.monthlySavings,
                                change: comparison.change.savings.percent ?? 0,
                                type: "savings",
                            },
                        ]}
                    />
                    <Spacer size="md"/>
                    <AccountsSection accounts={accounts}/>
                    <Spacer size="md"/>
                    <ActivitySection transactions={recentTransactions}/>
                    <Spacer size="md"/>
                </ScrollView>
            </View>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 0,
    },

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.sm,
    },

    monthSelector: {
        flex: 1,
    },

    settingsButton: {
        width: 40,
        height: 40,
        marginLeft: spacing.sm,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    pressed: {
        opacity: 0.7,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: spacing.lg,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});