import {Platform} from "react-native";

export const shadows = {
    card:
        Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
            }
            : {
                elevation: 2,
            },
};