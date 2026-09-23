import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { forgotPassword } from "@/services/authService";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(){
        setError("");
        setMessage("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            await forgotPassword(trimmedEmail);

            setMessage(
                "If an account exists with that email, " +
                "we've sent a password reset link."
            );
        } catch (error: any) {
            setError(
                error?.response?.data?.detail ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Text style={styles.backText}>‹ Back</Text>
            </Pressable>

            <View style={styles.content}>
                <Text style={styles.title}>
                    Forgot your password?
                </Text>

                <Text style={styles.subtitle}>
                    Enter the email associated with your
                    Aksyon account and we'll send you a
                    password reset link.
                </Text>

                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    style={styles.input}
                />

                {error ? (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                ) : null}

                {message ? (
                    <Text style={styles.success}>
                        {message}
                    </Text>
                ) : null}

                <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[
                        styles.button,
                        loading && styles.buttonDisabled,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Send reset link
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.loginText}>
                        Remember your password?{" "}
                        <Text style={styles.loginLink}>
                            Log in
                        </Text>
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    backButton: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    backText: {
        fontSize: 16,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingBottom: 80,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 23,
        color: "#666",
        marginBottom: 28,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 10,
    },

    error: {
        color: "#d32f2f",
        marginBottom: 12,
    },

    success: {
        color: "#2e7d32",
        marginBottom: 12,
        lineHeight: 20,
    },

    button: {
        height: 52,
        borderRadius: 10,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 20,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    loginText: {
        textAlign: "center",
        color: "#666",
        fontSize: 14,
    },

    loginLink: {
        color: "#111",
        fontWeight: "600",
    },
});