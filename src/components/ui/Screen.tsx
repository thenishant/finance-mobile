import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";

type Props = {
    children: React.ReactNode;
};

export const Screen: React.FC<Props> = ({children}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20,
    },
});