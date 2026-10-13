import { resetPassword } from "@/services/authService";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
    const { userId, token } = useLocalSearchParams<{
        userId: string;
        token: string;
    }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit() {
        setError("");

        if (!userId || !token) {
            setError(
                "This password reset link is incomplete. Please request a new one."
            );
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await resetPassword(
                userId,
                token,
                password
            );

            setSuccess(true);
        } catch (error: any) {
            const detail = error?.response?.data?.detail;

            setError(
                Array.isArray(detail)
                    ? detail.join("\n")
                    : typeof detail === "string"
                        ? detail
                        : "Unable to reset your password. The link may be invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {success ? (
                    <>
                        <Text style={styles.title}>
                            Password reset successful
                        </Text>

                        <Text style={styles.subtitle}>
                            Your password has been changed.
                            You can now sign in using your new password.
                        </Text>

                        <Pressable
                            style={styles.button}
                            onPress={() =>
                                router.replace("/(auth)/login")
                            }
                        >
                            <Text style={styles.buttonText}>
                                Return to login
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>
                            Reset your password
                        </Text>

                        <Text style={styles.subtitle}>
                            Enter a new password for your Aksyon account.
                        </Text>

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="New password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                            style={styles.input}
                        />

                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            secureTextEntry
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
                                    Reset password
                                </Text>
                            )}
                        </Pressable>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
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
        marginBottom: 14,
    },

    error: {
        color: "#d32f2f",
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
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});