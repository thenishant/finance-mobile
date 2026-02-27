import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import * as WebBrowser from "expo-web-browser";
import {authService} from "../../services/auth.service";
import {useAuth} from "../../hooks/useAuth";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "../../navigation/AuthNavigator";
import {api} from "../../services/api";
import {supabase} from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen = ({navigation}: Props) => {
    const {login} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const {data: listener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("AUTH EVENT:", event);
                console.log("SESSION:", session?.access_token);

                if (event === "SIGNED_IN" && session?.access_token) {
                    try {
                        console.log("Sending token to backend...");

                        const res = await api.post("/auth/google", {
                            supabaseToken: session.access_token,
                        });

                        const appToken = res.data.data.token;

                        console.log("Backend token received:", appToken);

                        await login(appToken);

                        console.log("Login context updated");

                    } catch (err) {
                        console.log("API BASE URL:", api.defaults.baseURL);
                        console.log("Backend exchange failed:", err);
                    }
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = async () => {
        try {
            const token = await authService.login(email, password);
            await login(token);
        } catch (error) {
            Alert.alert("Login Failed", "Invalid credentials");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            console.log("Google button clicked");

            const redirectTo = "finance-mobile://";

            const {data, error} = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    redirectTo
                );

                console.log("Auth session result:", result);

                if (result.type === "success" && result.url) {
                    // 🔥 Extract tokens from URL
                    const params = new URLSearchParams(
                        result.url.split("#")[1]
                    );

                    const access_token = params.get("access_token");
                    const refresh_token = params.get("refresh_token");

                    if (!access_token || !refresh_token) {
                        throw new Error("Missing tokens from OAuth redirect");
                    }

                    // 🔥 Restore Supabase session manually
                    const {error: sessionError} =
                        await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });

                    if (sessionError) throw sessionError;
                }
            }

        } catch (err) {
            console.log("Google login failed:", err);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Finance</Text>
            <Text style={styles.subtitle}>Track. Grow. Simplify.</Text>

            <View style={styles.card}>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                    <Text style={styles.primaryText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.secondaryText}>Create Account</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line}/>
                    <Text style={styles.or}>OR</Text>
                    <View style={styles.line}/>
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                >
                    <Text style={styles.googleText}>Continue with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        padding: 24,
    },

    logo: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 6,
    },

    subtitle: {
        textAlign: "center",
        color: "#6B7280",
        marginBottom: 32,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
    },

    input: {
        backgroundColor: "#F9FAFB",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },

    primaryButton: {
        backgroundColor: "#2563EB",
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
        color: "#2563EB",
        fontWeight: "500",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
    },

    or: {
        marginHorizontal: 10,
        color: "#9CA3AF",
    },

    googleButton: {
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    googleText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});