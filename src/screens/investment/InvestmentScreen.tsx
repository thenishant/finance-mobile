import React, {useRef, useState} from "react";
import {Animated, StyleSheet, View} from "react-native";

import {useAnalytics} from "../../hooks/useAnalytics";
import {useYearAnalytics} from "../../hooks/useYearlyAnalytics";

import {MonthSelector} from "../../components/ui/MonthSelector";
import {SetInvestmentGoalScreen} from "../../components/investment/SetInvestmentGoalScreen";

import {useMonthStore} from "../../stores/useMonthStore";
import {MonthDetailsSheet, SetInvestmentGoalSheet} from "../../components/investment/SetInvestmentGoalSheet";

import {SafeAreaView} from "react-native-safe-area-context";

export const InvestmentScreen = () => {

    const {data} = useAnalytics();
    const {data: yearData} = useYearAnalytics(new Date().getFullYear());

    const months = yearData?.months ?? [];

    const [goalOpen, setGoalOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<any>(null);

    const scrollY = useRef(new Animated.Value(0)).current;

    const {month} = useMonthStore();

    const activeMonth =
        months.find((m: any) => m.month === month) ?? null;

    return (
        <View style={styles.container}>

            {/* 🔥 SAME SAFE AREA */}
            <SafeAreaView edges={["top"]} style={styles.topSafeArea}/>

            <Animated.ScrollView
                contentContainerStyle={{paddingBottom: 60}}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false}
                )}
                scrollEventThrottle={16}
            >

                {/* 🔥 SAME HEADER BLOCK */}
                <View style={styles.topSection}>
                    <MonthSelector
                        variant="dark"
                        scrollY={scrollY}
                    />
                </View>

                {/* CONTENT */}
                <SetInvestmentGoalScreen
                    goal={data?.investmentGoal}
                    month={activeMonth}
                    months={months}
                    onSetGoal={() => setGoalOpen(true)}
                    onMonthPress={(m: any) => {
                        setSelectedMonth(m);
                        setMonthOpen(true);
                    }}
                />

            </Animated.ScrollView>

            <MonthDetailsSheet
                visible={monthOpen}
                month={selectedMonth}
                onClose={() => setMonthOpen(false)}
            />

            <SetInvestmentGoalSheet
                visible={goalOpen}
                income={data?.totalIncome ?? 0}
                onClose={() => setGoalOpen(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },

    topSafeArea: {
        backgroundColor: "#0F172A",
    },

    topSection: {
        backgroundColor: "#0F172A",
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});