import {memo} from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
    label: string;
    value: string;
    subValue?: string;
    onPress: () => void;
};

export const Row = memo(
    ({
         label,
         value,
         subValue,
         onPress,
     }: Props) => (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.row,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.content}>
                <View style={styles.left}>
                    <Text style={styles.label}>
                        {label}
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={styles.value}
                    >
                        {value}
                    </Text>

                    {subValue && (
                        <Text style={styles.subValue}>
                            {subValue}
                        </Text>
                    )}
                </View>

                <Text style={styles.chevron}>
                    ›
                </Text>
            </View>
        </Pressable>
    )
);

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 18,
        paddingVertical: 16,
        backgroundColor: "#FFF",
    },

    pressed: {
        opacity: 0.75,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
    },

    left: {
        flex: 1,
    },

    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 6,
    },

    value: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    subValue: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
    },

    chevron: {
        fontSize: 20,
        color: "#D1D5DB",
        marginLeft: 12,
    },
});