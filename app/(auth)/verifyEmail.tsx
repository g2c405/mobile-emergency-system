import {
    resendRegistrationOTP,
    verifyEmail,
} from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";

export default function VerifyEmailScreen() {
    const { userId, email } = useLocalSearchParams<{
        userId: string;
        email: string;
    }>();

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const [formError, setFormError] = useState("");
    const [message, setMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setTimeout(() => {
            setCooldown((previous) => previous - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [cooldown]);

    async function handleVerify() {
        if (!userId || verifying || code.length !== 6) return;

        setVerifying(true);
        setFormError("");
        setMessage("");

        try {
            await verifyEmail(Number(userId), code);

            router.replace("/(auth)/login");
        } catch (error: any) {
            const responseData = error.response?.data;

            setFormError(
                responseData?.detail ||
                responseData?.code?.[0] ||
                "Unable to verify your email. Please try again."
            );
        } finally {
            setVerifying(false);
        }
    }

    async function handleResend() {
        if (!userId || resending || cooldown > 0) return;

        setResending(true);
        setFormError("");
        setMessage("");

        try {
            await resendRegistrationOTP(Number(userId));

            setMessage("A new verification code has been sent to your email.");
            setCooldown(60);
            setCode("");
        } catch (error: any) {
            const responseData = error.response?.data;

            if (error.response?.status === 429) {
                const retryAfter = responseData?.retry_after;

                if (retryAfter) {
                    setCooldown(retryAfter);
                }
            }

            setFormError(
                responseData?.detail ||
                "Unable to resend the verification code. Please try again."
            );
        } finally {
            setResending(false);
        }
    }

    const isButtonDisabled =
        code.length !== 6 || verifying || resending;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={
                    Platform.OS === "ios" ? "padding" : "height"
                }
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#222222"
                            />
                            <Text style={styles.backText}>Back</Text>
                        </Pressable>

                        <View style={styles.header}>
                            <Text style={styles.heading}>
                                Verify Your Email
                            </Text>

                            <Text style={styles.subtitle}>
                                We've sent a verification code to{" "}
                                <Text style={styles.email}>
                                    {email || "your email address"}
                                </Text>
                                . Enter the code below to activate your
                                Aksyon account.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <AuthInput
                                placeholder="Enter 6-digit code"
                                value={code}
                                onChangeText={(value: string) => {
                                    setCode(
                                        value.replace(/[^0-9]/g, "").slice(0, 6)
                                    );
                                    setFormError("");
                                }}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={
                                    formError && !message
                                        ? formError
                                        : undefined
                                }
                            />

                            {message !== "" && (
                                <Text style={styles.success}>
                                    {message}
                                </Text>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            <AuthButton
                                title="Verify Email"
                                loading={verifying}
                                onPress={handleVerify}
                                disabled={isButtonDisabled}
                            />

                            <Pressable
                                onPress={handleResend}
                                disabled={
                                    resending ||
                                    cooldown > 0 ||
                                    verifying
                                }
                                style={styles.resendContainer}
                            >
                                <Text style={styles.resendText}>
                                    Didn't receive the code?{" "}
                                    <Text style={styles.resendLink}>
                                        {cooldown > 0
                                            ? `Resend in ${cooldown}s`
                                            : "Resend"}
                                    </Text>
                                </Text>
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={() => router.replace("/(auth)/login")}
                            disabled={verifying}
                            style={styles.loginContainer}
                        >
                            <Text style={styles.loginText}>
                                Already verified?{" "}
                                <Text style={styles.loginLink}>
                                    Log in
                                </Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 20,
        paddingBottom: 30,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 24,
    },
    backText: {
        fontSize: 15,
        color: "#444444",
        marginLeft: 2,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    heading: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "#222222",
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: "#888888",
        textAlign: "center",
        marginTop: 8,
        paddingHorizontal: 12,
    },
    email: {
        color: "#555555",
        fontWeight: "600",
    },
    form: {
        width: "100%",
        gap: 16,
    },
    success: {
        color: "#2E7D32",
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
        marginTop: -4,
    },
    buttonContainer: {
        marginTop: 24,
    },
    resendContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    resendText: {
        textAlign: "center",
        color: "#666666",
        fontSize: 14,
    },
    resendLink: {
        color: "#222222",
        fontWeight: "600",
    },
    loginContainer: {
        marginTop: 24,
        alignItems: "center",
    },
    loginText: {
        textAlign: "center",
        color: "#666666",
        fontSize: 14,
    },
    loginLink: {
        color: "#222222",
        fontWeight: "600",
    },
});