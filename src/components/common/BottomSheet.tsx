import React from "react";
import {Modal, Pressable, StyleSheet, View,} from "react-native";

import {Ionicons} from "@expo/vector-icons";

import {Body, Caption} from "../typography";
import {colors, radius, spacing} from "../../design";

interface Props {
    visible: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const BottomSheet = ({
                         visible,
                         title,
                         subtitle,
                         onClose,
                         children,
                     }: Props) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.root}>
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                <View style={styles.sheet}>
                    <View style={styles.handle}/>

                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Body style={styles.title}>
                                {title}
                            </Body>

                            {subtitle && (
                                <Caption color="muted">
                                    {subtitle}
                                </Caption>
                            )}
                        </View>

                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                            style={styles.closeButton}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={colors.textSecondary}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.content}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "flex-end",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
    },

    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },

    handle: {
        alignSelf: "center",
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        marginBottom: spacing.lg,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.lg,
    },

    headerText: {
        flex: 1,
        paddingRight: spacing.md,
    },

    title: {
        fontSize: 20,
        marginBottom: 3,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },

    content: {
        width: "100%",
    },
});

export default BottomSheet;