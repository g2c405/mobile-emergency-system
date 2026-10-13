import axios from "axios";
import { Alert } from "react-native";

export const handleApiError = (error: unknown) => {
    console.log("=== API ERROR HANDLER ===");
    console.log("ERROR:", error);
    console.log(
        "IS AXIOS ERROR:",
        axios.isAxiosError(error)
    );
    console.log(
        "IS CANCEL:",
        axios.isCancel(error)
    );


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
        (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || error.code === "ERR_NETWORK")
    ) {
        console.log("→ TIMEOUT DETECTED");
        console.log("TIMEOUT CODE:", error.code);
        console.log("TIMEOUT MESSAGE:", error.message);
        Alert.alert(
            "Poor Network Connection",
            "Network connection is poor. Please try again later."
        );

        return;
    }

    if (
        axios.isAxiosError(error) &&
        error.response?.status === 503
    ) {
        Alert.alert(
            "Server unavailable",
            "The server is currently unavailable. Please try again later."
        );

        return;
    }

    console.log("→ UNHANDLED API ERROR");
    console.log("CODE:", axios.isAxiosError(error) ? error.code : "N/A");
    console.log("MESSAGE:", error instanceof Error ? error.message : "N/A");
};