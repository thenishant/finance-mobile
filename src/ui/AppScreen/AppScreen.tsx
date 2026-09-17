import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleProp,
    View,
    ViewStyle,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {colors, spacing} from "../../design";


export interface AppScreenProps {
    children: React.ReactNode;
    scroll?: boolean;
    padded?: boolean;
    keyboard?: boolean;
    safeArea?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export const AppScreen = ({
                              children,
                              scroll = false,
                              padded = true,
                              keyboard = true,
                              safeArea = true,
                              refreshing = false,
                              onRefresh,
                              style,
                              contentContainerStyle,
                          }: AppScreenProps) => {
    const content = scroll ? (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{
                flexGrow: 1,
                padding: padded
                    ? spacing.lg
                    : 0,
            }, contentContainerStyle
            ]}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                ) : undefined
            }
        >
            {children}
        </ScrollView>) : (<View style={[{
            flex: 1,
            padding: padded
                ? spacing.lg
                : 0,
        },
            contentContainerStyle,
        ]}
        >
            {children}
        </View>
    );

    const wrappedContent = keyboard ? (
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={
                    Platform.OS === "ios" ? "padding" : undefined
                }
            >
                {content}
            </KeyboardAvoidingView>
        )
        : content;

    const screen = (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor:
                    colors.background,
                },
                style,
            ]}
        >
            <StatusBar
                translucent={false}
                backgroundColor={colors.background}
                barStyle="light-content"
            />

            {wrappedContent}
        </View>
    );

    if (!safeArea) {
        return screen;
    }

    return (
        <SafeAreaView
            edges={[
                "top",
                "left",
                "right",
                "bottom",
            ]}
            style={{
                flex: 1,
                backgroundColor:
                colors.background,
            }}
        >
            {screen}
        </SafeAreaView>
    );
};

export default AppScreen;