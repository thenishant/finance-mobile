import React, {useEffect, useRef, useState} from "react";
import {Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View} from "react-native";

import {Button, Input, Pill} from "../ui";

interface Props {
    visible: boolean;

    title: string;
    subtitle?: string;

    presets?: string[];

    value?: string;
    placeholder?: string;

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

                    <Text style={styles.title}>
                        {title}
                    </Text>

                    {subtitle && (
                        <Text style={styles.subtitle}>
                            {subtitle}
                        </Text>
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
                    />

                </Animated.View>

            </Animated.View>

        </Modal>
    );
};

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end"
    },

    backdrop: {
        flex: 1
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 30
    },

    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 14
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4
    },

    subtitle: {
        color: "#6B7280",
        marginBottom: 16
    },

    preview: {
        alignItems: "center",
        marginBottom: 16
    },

    presets: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16
    },

    input: {
        marginBottom: 20
    }
});