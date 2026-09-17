import React from "react";
import {Pressable, StyleSheet, View,} from "react-native";

import {Body, Heading,} from "../typography";

import {spacing,} from "../../design";

import {HStack,} from "../layout";

interface Props {

    title: string;

    subtitle?: string;

    actionText?: string;

    onAction?: () => void;

    right?: React.ReactNode;
}

export default function Section({

                                    title,

                                    subtitle,

                                    actionText,

                                    onAction,

                                    right,

                                }: Props) {

    return (

        <View style={styles.container}>

            <HStack
                justify="space-between"
                align="center"
            >

                <View style={{flex: 1}}>

                    <Heading>

                        {title}

                    </Heading>

                    {subtitle && (

                        <Body
                            color="textSecondary"
                        >

                            {subtitle}

                        </Body>

                    )}

                </View>

                {right}

                {!right && actionText && (

                    <Pressable
                        onPress={onAction}
                    >

                        <Body
                            weight="medium"
                            color="primary"
                        >

                            {actionText}

                        </Body>

                    </Pressable>

                )}

            </HStack>

        </View>

    );
}

const styles = StyleSheet.create({

    container: {

        marginBottom: spacing.lg,

    },

});