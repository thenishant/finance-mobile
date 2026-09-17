import React from "react";
import {StyleSheet, View} from "react-native";


import {spacing} from "../../../design";
import {Caption} from "../../typography";

interface Props {
    title: string;
    children: React.ReactNode;
}

export const FilterGroup = ({
                                title,
                                children,
                            }: Props) => {
    return (
        <View style={styles.container}>
            <Caption
                color="muted"
                style={styles.title}
            >
                {title}
            </Caption>

            <View style={styles.options}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },

    title: {
        marginBottom: spacing.sm,
    },

    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
});