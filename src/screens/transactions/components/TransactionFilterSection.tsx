import React from "react";
import {StyleSheet, View} from "react-native";

import {Caption} from "../../../components/typography";
import {spacing} from "../../../design";
import {SelectableOption} from "../../../components/common/ui";
import {Button} from "../../../components/Button";

export interface FilterOption {
    label: string;
    selected: boolean;
    onPress: () => void;
    icon?: any;
}

export interface Filter {
    title: string;
    options: FilterOption[];
}

interface Props {
    filter: Filter;
    onReset?: () => void;
    onApply?: () => void;
}

export const TransactionFilterSection = ({
                                             filter,
                                             onReset,
                                             onApply,
                                         }: Props) => {
    return (
        <View style={styles.container}>
            <Caption
                color="muted"
                style={styles.title}
            >
                {filter.title}
            </Caption>

            <View style={styles.options}>
                {filter.options.map(option => (
                    <SelectableOption
                        key={option.label}
                        label={option.label}
                        selected={option.selected}
                        onPress={option.onPress}
                        icon={option.icon}
                    />
                ))}
            </View>

            {(onReset || onApply) && (
                <View style={styles.actions}>
                    {onReset && (
                        <View style={styles.reset}>
                            <Button
                                title="Reset"
                                variant="secondary"
                                size="md"
                                leftIcon="refresh-outline"
                                onPress={onReset}
                                fullWidth
                            />
                        </View>
                    )}

                    {onApply && (
                        <View style={styles.apply}>
                            <Button
                                title="Apply filters"
                                variant="primary"
                                size="md"
                                leftIcon="checkmark-outline"
                                onPress={onApply}
                                fullWidth
                            />
                        </View>
                    )}
                </View>
            )}
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

    actions: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.md,
    },

    reset: {
        flex: 1,
    },

    apply: {
        flex: 2,
    },
});