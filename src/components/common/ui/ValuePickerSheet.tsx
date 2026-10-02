import React, {useEffect, useRef, useState} from "react";
import {Animated, Dimensions, Modal, Pressable, StyleSheet, View} from "react-native";

import {Input, Pill} from "./index";
import {Button} from "../../Button";

import {Body, Heading} from "../../typography";
import {colors, radius, spacing} from "../../../design";

interface Props {
    visible: boolean;

    title: string;
    subtitle?: string;

    presets?: string[];

    value?: string;
    placeholder?: string;

    loading?: boolean;

    onChange?: (value: string) => void;
    onSave: (value: string) => void;
    onClose: () => void;

    renderPreview?: (value: string) => React.ReactNode;
}

export const ValuePickerSheet = ({
                                     visible,
                                     title,
                                     subtitle,
                                     presets = [],
                                     value = "",
                                     placeholder,
                                     loading = false,
                                     onChange,
                                     onSave,
                                     onClose,
                                     renderPreview
                                 }: Props) => {

    const [localValue, setLocalValue] = useState(value);

    const screenHeight = Dimensions.get("window").height;

    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const backdrop = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    useEffect(() => {

        if (visible) {

            translateY.setValue(screenHeight);
            backdrop.setValue(0);

            Animated.parallel([
                Animated.timing(backdrop, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 20,
                    stiffness: 160,
                    mass: 0.8,
                    useNativeDriver: true
                })
            ]).start();
        }

    }, [visible]);

    const closeSheet = () => {

        Animated.parallel([
            Animated.timing(backdrop, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: screenHeight,
                duration: 220,
                useNativeDriver: true
            })
        ]).start(onClose);

    };

    const handleChange = (v: string) => {
        setLocalValue(v);
        onChange?.(v);
    };

    const handleSave = () => {
        if (loading) {
            return;
        }

        onSave(localValue);
        closeSheet();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >

            <Animated.View style={[styles.overlay, {opacity: backdrop}]}>

                <Pressable
                    style={styles.backdrop}
                    onPress={closeSheet}
                />

                <Animated.View
                    style={[styles.sheet, {transform: [{translateY}]}]}
                >

                    <View style={styles.handle}/>

                    <Heading>
                        {title}
                    </Heading>

                    {subtitle && (
                        <Body
                            color="textSecondary"
                            style={styles.subtitle}
                        >
                            {subtitle}
                        </Body>
                    )}

                    {renderPreview && (
                        <View style={styles.preview}>
                            {renderPreview(localValue)}
                        </View>
                    )}

                    {presets.length > 0 && (
                        <View style={styles.presets}>
                            {presets.map(p => (
                                <Pill
                                    key={p}
                                    label={p}
                                    active={localValue === p}
                                    onPress={() => handleChange(p)}
                                />
                            ))}
                        </View>
                    )}

                    <Input
                        value={localValue}
                        onChangeText={handleChange}
                        placeholder={placeholder}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <Button
                        title="Save"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                    />

                </Animated.View>

            </Animated.View>

        </Modal>
    );
};

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end"
    },

    backdrop: {
        flex: 1
    },

    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        padding: spacing.lg,
        paddingBottom: spacing.xxl
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: colors.border,
        borderRadius: radius.xs,
        alignSelf: "center",
        marginBottom: spacing.lg
    },

    subtitle: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg
    },

    preview: {
        alignItems: "center",
        marginBottom: spacing.lg
    },

    presets: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: spacing.lg
    },

    input: {
        marginBottom: spacing.lg
    }
});