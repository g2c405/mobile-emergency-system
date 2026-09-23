import axios from "axios";
import { Alert } from "react-native";

export const handleApiError = (error: unknown) => {
    console.log("API ERROR:", error);

    if (axios.isCancel(error)) {
        console.log("CANCEL MESSAGE:", error.message);

        Alert.alert(
            "No Internet Connection",
            "Please check your internet connection and try again."
        );

        return;
    }

    if (
        axios.isAxiosError(error) &&
        (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    ) {
        Alert.alert(
            "Poor Network Connection",
            "Network connection is poor. Please try again later."
        );

        return;
    }

    console.log("Unhandled API error:", error);
};