import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import { forgotPassword } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Controller,
    useForm,
} from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ForgotPasswordForm {
    email: string;
}

const COOLDOWN_SECONDS = 60;

export default function ForgotPasswordScreen() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        defaultValues: {
            email: "",
        },
    });

    // Keep the cooldown counting down once it starts.
    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setCooldown((previous) =>
                Math.max(previous - 1, 0)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown > 0]);

    async function handleForgotPassword(
        data: ForgotPasswordForm
    ) {
        // Prevent duplicate submissions while loading or cooling down.
        if (loading || cooldown > 0) {
            return;
        }

        // Start the cooldown immediately, before the API request.
        setCooldown(COOLDOWN_SECONDS);
        setLoading(true);
        setMessage("");
        setFormError(null);

        try {
            await forgotPassword(data.email.trim());

            setMessage(
                "If an account exists with that email, we've sent a password reset link."
            );
        } catch (error: any) {
            console.error(
                "FORGOT PASSWORD ERROR:",
                error.response?.data ?? error
            );

            setFormError(
                error?.response?.data?.detail ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    const isButtonDisabled = loading || cooldown > 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
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
                            <Text style={styles.backText}>
                                Back
                            </Text>
                        </Pressable>

                        <View style={styles.header}>
                            <Text style={styles.heading}>
                                Forgot Password
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter the email associated with your
                                Aksyon account and we'll send you a
                                password reset link.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required:
                                        "Please enter your email address.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Please enter a valid email address.",
                                    },
                                }}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                    },
                                }) => (
                                    <AuthInput
                                        placeholder="Email address"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={errors.email?.message}
                                    />
                                )}
                            />

                            {formError && (
                                <Text style={styles.formError}>
                                    {formError}
                                </Text>
                            )}

                            {message !== "" && (
                                <Text style={styles.success}>
                                    {message}
                                </Text>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            <AuthButton
                                title={
                                    cooldown > 0
                                        ? `Try again in ${cooldown}s`
                                        : "Send Reset Link"
                                }
                                loading={loading || cooldown > 0}
                                onPress={handleSubmit(
                                    handleForgotPassword
                                )}
                                disabled={isButtonDisabled}
                            />

                            {cooldown > 0 && (
                                <View style={styles.cooldownContainer}>
                                    <Text style={styles.cooldownText}>
                                        Please wait {cooldown}{" "}
                                        {cooldown === 1
                                            ? "second"
                                            : "seconds"}{" "}
                                        before requesting another link.
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Pressable
                            onPress={() => router.back()}
                            disabled={loading}
                            style={styles.loginContainer}
                        >
                            <Text style={styles.loginText}>
                                Remember your password?{" "}
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
        paddingHorizontal: 20,
    },
    form: {
        width: "100%",
        gap: 16,
    },
    formError: {
        color: "#C62828",
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
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
    cooldownContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 14,
    },
    cooldownText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: "#777777",
        textAlign: "center",
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