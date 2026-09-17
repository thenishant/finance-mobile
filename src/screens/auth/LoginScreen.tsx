import React, {useState} from "react";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

import {AuthStackParamList} from "../../navigation/AuthNavigator";
import {useAuth} from "../../hooks/useAuth";
import {authService} from "../../services/auth.service";
import {supabase} from "../../lib/supabase";

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

    const [googleLoading, setGoogleLoading] =
        useState(false);

    const handleLogin = async () => {
        try {
            await loginWithPassword(
                email.trim(),
                password,
            );
        } catch (error) {
            console.error(
                "Login failed:",
                error,
            );

            Alert.alert(
                "Login Failed",
                "Invalid credentials",
            );
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

            console.log(
                "Opening Google OAuth:",
                authUrl,
            );

            console.log(
                "OAuth redirect:",
                redirectTo,
            );

            const result =
                await WebBrowser.openAuthSessionAsync(
                    authUrl,
                    redirectTo,
                );

            console.log(
                "Google OAuth result:",
                result,
            );

            if (
                result.type !== "success" ||
                !result.url
            ) {
                console.log(
                    "Google OAuth cancelled",
                );
                return;
            }

            console.log(
                "Google callback URL:",
                result.url,
            );

            const {
                params,
                errorCode,
            } =
                QueryParams.getQueryParams(
                    result.url,
                );

            console.log(
                "OAuth callback params:",
                params,
            );

            if (errorCode) {
                throw new Error(errorCode);
            }

            /*
             * Implicit flow returns the access token
             * in the callback URL.
             */
            if (!params.access_token) {
                throw new Error(
                    "Google authentication did not return a Supabase access token.",
                );
            }

            /*
             * Give the token to Supabase so it creates
             * and persists the local session.
             */
            console.log(
                "Google OAuth Access Token:",
                params.access_token,
            );

            console.log(
                "Google OAuth Refresh Token:",
                params.refresh_token,
            );

            const {data, error} = await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token ?? "",
            });

            if (error) {
                throw error;
            }

            const supabaseToken = data.session?.access_token;

            if (!supabaseToken) {
                throw new Error(
                    "Supabase session was not created.",
                );
            }

            console.log(
                "Supabase Access Token:",
                supabaseToken,
            );

            await loginWithGoogle(supabaseToken);

            console.log("Finance application authentication successful",);

            if (error) {
                throw error;
            }

            if (!data.session?.access_token) {
                throw new Error(
                    "Supabase session was not created.",
                );
            }

            console.log(
                "Supabase authentication successful",
            );

        } catch (error) {
            console.error(
                "Google login failed:",
                error,
            );

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
        <View style={styles.container}>
            <Text style={styles.logo}>
                Finance
            </Text>

            <Text style={styles.subtitle}>
                Track. Grow. Simplify.
            </Text>

            <View style={styles.card}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#71717A"
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#71717A"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                >
                    <Text
                        style={styles.primaryText}
                    >
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                        navigation.navigate(
                            "Register",
                        )
                    }
                >
                    <Text
                        style={styles.secondaryText}
                    >
                        Create Account
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line}/>

                    <Text style={styles.or}>
                        OR
                    </Text>

                    <View style={styles.line}/>
                </View>

                <TouchableOpacity
                    style={[
                        styles.googleButton,
                        googleLoading &&
                        styles.googleButtonDisabled,
                    ]}
                    onPress={handleGoogleLogin}
                    disabled={googleLoading}
                >
                    <Text
                        style={styles.googleText}
                    >
                        {googleLoading
                            ? "Connecting..."
                            : "Continue with Google"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        padding: 24,
    },

    logo: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 6,
    },

    subtitle: {
        textAlign: "center",
        color: "#A1A1AA",
        marginBottom: 32,
    },

    card: {
        backgroundColor: "#131316",
        padding: 24,
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2C2C33",
    },

    input: {
        backgroundColor: "#1A1A1F",
        color: "#FFFFFF",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2C2C33",
    },

    primaryButton: {
        backgroundColor: "#4F8CFF",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },

    primaryText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    secondaryButton: {
        padding: 12,
        alignItems: "center",
    },

    secondaryText: {
        color: "#4F8CFF",
        fontWeight: "500",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#2C2C33",
    },

    or: {
        marginHorizontal: 10,
        color: "#71717A",
    },

    googleButton: {
        backgroundColor: "#222228",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#2C2C33",
    },

    googleButtonDisabled: {
        opacity: 0.5,
    },

    googleText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});