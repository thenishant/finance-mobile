import React from "react";
import {StyleSheet, View} from "react-native";

import {spacing} from "../../../design";

interface Props {
    children: React.ReactNode;
}

export const TransactionSortSection = ({
                                           children,
                                       }: Props) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
    },
});