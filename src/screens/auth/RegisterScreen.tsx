import React, {useState} from "react";
import {Alert, Button, StyleSheet, TextInput, View} from "react-native";
import {authService} from "../../services/auth.service";
import {useAuth} from "../../hooks/useAuth";

const RegisterScreen = () => {
    const {login} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const token = await authService.register(email, password);
            await login(token);
        } catch (error) {
            Alert.alert("Registration Failed", "Try again");
        }
    };

    return (
        <View style={styles.container}>
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

            <Button title="Register" onPress={handleRegister}/>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 16,
        borderRadius: 6
    }
});