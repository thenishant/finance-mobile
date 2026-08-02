import React from "react";
import {ScrollView, StyleProp, StyleSheet, ViewStyle,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {colors} from "../../../design";

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    style?: StyleProp<ViewStyle>;
};

export const Screen = ({children, scroll = false, style,}: Props) => {
    if (scroll) {
        return (
            <SafeAreaView style={styles.container}
                          edges={["left", "right", "bottom"]}>
                <ScrollView
                    contentContainerStyle={style}
                    showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, style]}
                      edges={["left", "right", "bottom"]}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 14,
        backgroundColor: colors.darkBackground,
    },
});