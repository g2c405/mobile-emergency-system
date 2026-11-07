import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import {
    resendContactNumberChangeOTP,
    verifyContactNumberChange,
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

export default function VerifyContactNumberChangeScreen() {
    const { contactNumber } = useLocalSearchParams<{
        contactNumber: string;
    }>();

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [formError, setFormError] = useState("");
    const [message, setMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((previous) => Math.max(previous - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    async function handleVerify() {
        if (code.length !== 6 || verifying) return;

        setVerifying(true);
        setFormError("");
        setMessage("");

        try {
            await verifyContactNumberChange(code);

            // TODO: Refresh the authenticated user's information.
            // TODO: Return to account settings.

            router.back();
        } catch (error: any) {
            console.error(
                "VERIFY CONTACT NUMBER ERROR:",
                error.response?.data ?? error
            );

            const backendErrors = error.response?.data;

            setFormError(
                backendErrors?.detail ??
                backendErrors?.code?.[0] ??
                "Failed to verify your contact number. Please try again."
            );
        } finally {
            setVerifying(false);
        }
    }

    async function handleResend() {
        if (resending || cooldown > 0) return;

        setResending(true);
        setFormError("");
        setMessage("");

        try {
            await resendContactNumberChangeOTP();

            setMessage("A new verification code has been sent to your registered email address.");
            setCode("");
        } catch (error: any) {
            console.error(
                "RESEND CONTACT NUMBER OTP ERROR:",
                error.response?.data ?? error
            );

            const backendErrors = error.response?.data;

            if (error.response?.status === 429) {
                setCooldown(backendErrors?.retry_after ?? 0);
                setFormError(
                    backendErrors?.detail ??
                    "Please wait before requesting another code."
                );
            } else {
                setFormError(
                    backendErrors?.detail ??
                    "Failed to resend the verification code. Please try again."
                );
            }
        } finally {
            setResending(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                            <Text style={styles.backText}>Cancel</Text>
                        </Pressable>

                        <View style={styles.header}>
                            <Text style={styles.heading}>
                                Verify Contact Number
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter the 6-digit verification code sent to your registered email address to confirm your new contact number.
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
                                maxLength={6}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={{
                                    paddingRight: 18,
                                    textAlign: "center",
                                    fontSize: 20,
                                    fontWeight: "600",
                                }}
                                error={formError || undefined}
                            />

                            {message ? (
                                <Text style={styles.successMessage}>
                                    {message}
                                </Text>
                            ) : null}

                            <Pressable
                                onPress={handleResend}
                                disabled={resending || cooldown > 0}
                                style={styles.resendButton}
                            >
                                <Text style={styles.resendText}>
                                    {resending
                                        ? "Sending..."
                                        : cooldown > 0
                                        ? `Resend code in ${cooldown}s`
                                        : "Resend verification code"}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.buttonContainer}>
                            <AuthButton
                                title="Verify contact number"
                                loading={verifying}
                                disabled={code.length !== 6}
                                onPress={handleVerify}
                            />
                        </View>
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
        paddingHorizontal: 20,
    },
    form: {
        width: "100%",
        gap: 16,
    },
    successMessage: {
        color: "#2E7D32",
        fontSize: 13,
        textAlign: "center",
    },
    resendButton: {
        alignSelf: "center",
        paddingVertical: 8,
    },
    resendText: {
        color: "#C62828",
        fontSize: 14,
        fontWeight: "600",
    },
    buttonContainer: {
        marginTop: 24,
    },
});