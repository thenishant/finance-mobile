import React, {useState} from "react";
import {ScrollView, StyleSheet} from "react-native";

import {useAnalytics} from "../../hooks/useAnalytics";
import {useYearAnalytics} from "../../hooks/useYearlyAnalytics";

import {MonthSelector} from "../../components/ui/MonthSelector";
import {InvestmentFeature} from "../../components/investment/InvestmentFeature";

import {useMonthStore} from "../../stores/useMonthStore";
import {MonthDetailsSheet, SetGoalSheet} from "../../components/investment/InvestmentSheet";

export const InvestmentScreen = () => {

    const {data} = useAnalytics();
    const {data: yearData} = useYearAnalytics(new Date().getFullYear());

    const months = yearData?.months ?? [];

    const [goalOpen, setGoalOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<any>(null);

    const {month} = useMonthStore();

    const activeMonth =
        months.find((m: any) => m.month === month) ?? null;

    return (
        <>
            <ScrollView style={styles.container}>

                <MonthSelector/>

                <InvestmentFeature
                    goal={data?.investmentGoal}
                    month={activeMonth}
                    months={months}
                    onSetGoal={() => setGoalOpen(true)}
                    onMonthPress={(m: any) => {
                        setSelectedMonth(m);
                        setMonthOpen(true);
                    }}
                />

            </ScrollView>

            <MonthDetailsSheet
                visible={monthOpen}
                month={selectedMonth}
                onClose={() => setMonthOpen(false)}
            />

            <SetGoalSheet
                visible={goalOpen}
                income={data?.totalIncome ?? 0}
                onClose={() => setGoalOpen(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});