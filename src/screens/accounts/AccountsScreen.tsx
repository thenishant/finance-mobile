import React, {useState} from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../hooks/useAuth";

const AccountsScreen = () => {
    const [gmailConnected, setGmailConnected] = useState(false);
    const [gmailEmail, setGmailEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {logout} = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {text: "Cancel", style: "cancel"},
                {text: "Logout", style: "destructive", onPress: logout},
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accounts</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccountsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
    },
    logoutButton: {
        backgroundColor: "#EF4444",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});