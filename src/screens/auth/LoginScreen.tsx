import React, {useState} from "react";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View,} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

import {AuthStackParamList} from "../../navigation/AuthNavigator";
import {useAuth} from "../../hooks/useAuth";
import {authService} from "../../services/auth.service";
import {supabase} from "../../lib/supabase";

import {AppScreen} from "../../ui";

import {Spacer,} from "../../components";

import {colors, spacing,} from "../../design";
import {AppText, Card, Input} from "../../components/common";
import {Button} from "../../components/Button";

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<
    AuthStackParamList,
    "Login"
>;

const LoginScreen = ({navigation}: Props) => {
    const {
        loginWithPassword,
        loginWithGoogle,
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginLoading, setLoginLoading] =
        useState(false);

    const [googleLoading, setGoogleLoading] =
        useState(false);

    const handleLogin = async () => {
        if (loginLoading) {
            return;
        }

        if (!email.trim() || !password) {
            Alert.alert(
                "Missing information",
                "Please enter your email and password.",
            );
            return;
        }

        setLoginLoading(true);

        try {
            await loginWithPassword(
                email.trim(),
                password,
            );
        } catch {
            Alert.alert(
                "Login Failed",
                "Invalid credentials.",
            );
        } finally {
            setLoginLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (googleLoading) {
            return;
        }

        setGoogleLoading(true);

        try {
            const {
                authUrl,
                redirectTo,
            } = await authService.startGoogleLogin();

            const result =
                await WebBrowser.openAuthSessionAsync(
                    authUrl,
                    redirectTo,
                );

            if (
                result.type !== "success" ||
                !result.url
            ) {
                return;
            }

            const {
                params,
                errorCode,
            } =
                QueryParams.getQueryParams(
                    result.url,
                );

            if (errorCode) {
                throw new Error(errorCode);
            }

            if (!params.access_token) {
                throw new Error(
                    "Google authentication did not return a Supabase access token.",
                );
            }

            const {
                data,
                error,
            } = await supabase.auth.setSession({
                access_token:
                params.access_token,
                refresh_token:
                    params.refresh_token ?? "",
            });

            if (error) {
                throw error;
            }

            const supabaseToken =
                data.session?.access_token;

            if (!supabaseToken) {
                throw new Error(
                    "Supabase session was not created.",
                );
            }

            await loginWithGoogle(
                supabaseToken,
            );
        } catch (error) {
            Alert.alert(
                "Google Login Failed",
                error instanceof Error
                    ? error.message
                    : "Please try again.",
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <AppScreen
            keyboard={false}
            padded={false}
        >
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.loginContainer}>
                        <View style={styles.header}>
                            <AppText
                                variant="display"
                                style={styles.logo}
                            >
                                Finance
                            </AppText>

                            <Spacer size="xs"/>

                            <AppText
                                variant="body"
                                color={colors.textSecondary}
                                style={styles.subtitle}
                            >
                                Track. Grow. Simplify.
                            </AppText>
                        </View>
                    </View>

                    <Card padding={spacing.lg}>
                        <Input
                            placeholder="Email"
                            placeholderTextColor={
                                colors.textMuted
                            }
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Spacer size="sm"/>

                        <Input
                            placeholder="Password"
                            placeholderTextColor={
                                colors.textMuted
                            }
                            secureTextEntry
                            textContentType="password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <Spacer size="sm"/>

                        <Button
                            title={
                                loginLoading
                                    ? "Logging in..."
                                    : "Login"
                            }
                            onPress={handleLogin}
                            disabled={loginLoading}
                        />

                        <Spacer size="xs"/>

                        <Button
                            title="Create Account"
                            variant="secondary"
                            onPress={() =>
                                navigation.navigate(
                                    "Register",
                                )
                            }
                        />

                        <View style={styles.divider}>
                            <View
                                style={
                                    styles.dividerLine
                                }
                            />

                            <AppText
                                variant="caption"
                                color={
                                    colors.textSecondary
                                }
                            >
                                OR
                            </AppText>

                            <View
                                style={
                                    styles.dividerLine
                                }
                            />
                        </View>

                        <Button
                            title={
                                googleLoading
                                    ? "Connecting..."
                                    : "Continue with Google"
                            }
                            variant="secondary"
                            onPress={
                                handleGoogleLogin
                            }
                            disabled={
                                googleLoading
                            }
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppScreen>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    keyboard: {
        flex: 1,
    },

    content: {
        justifyContent: "center",
        padding: spacing.lg,
        marginTop: spacing.xl,
    },

    loginContainer: {
        width: "100%",
    },

    header: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },

    logo: {
        textAlign: "center",
    },

    subtitle: {
        textAlign: "center",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginVertical: spacing.lg,
    },

    dividerLine: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
});