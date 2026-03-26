import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet} from "react-native";
import {useMonthlyAnalytics} from "../../hooks/useMonthlyAnalytics";
import {CategoryBreakdown} from "./components/CategoryBreakdown";
import {useMonthStore} from "../../stores/useMonthStore";
import {MonthSelector} from "../../components/ui/MonthSelector";

const AnalyticsScreen = () => {
    const {year, month} = useMonthStore();

    const {data, isLoading} =
        useMonthlyAnalytics(year, month);

    if (!data) return null;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <MonthSelector/>
            <CategoryBreakdown data={data}/>
        </SafeAreaView>
    );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});