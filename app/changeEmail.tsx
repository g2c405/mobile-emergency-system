import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import { changeEmail } from "@/services/authService";
import { ChangeEmailRequest } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Controller,
    useForm,
} from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

interface ChangeEmailForm
    extends ChangeEmailRequest {}

export default function ChangeEmailScreen() {
    const [loading, setLoading] = useState(false);
    const [changeEmailError, setChangeEmailError] =
        useState<string | null>(null);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ChangeEmailForm>({
        defaultValues: {
            new_email: "",
        },
    });

    async function handleChangeEmail(
        data: ChangeEmailForm
    ) {
        setLoading(true);
        setChangeEmailError(null);

        try {
            await changeEmail({
                new_email: data.new_email,
            });

            Alert.alert(
                "Verification Email Sent",
                "A verification link has been sent to your new email address. Your email address will only change after you verify it.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            console.error(
                "CHANGE EMAIL ERROR:",
                error.response?.data ?? error
            );

            const backendErrors =
                error.response?.data;

            if (backendErrors?.new_email) {
                setError("new_email", {
                    type: "server",
                    message:
                        backendErrors.new_email[0],
                });
            }

            if (!backendErrors?.new_email) {
                setChangeEmailError(
                    "Failed to change your email. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

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
                    contentContainerStyle={
                        styles.scrollContent
                    }
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
                                Cancel
                            </Text>
                        </Pressable>

                        <View
                            style={styles.header}
                        >
                            <Text
                                style={styles.heading}
                            >
                                Change Email
                            </Text>

                            <Text
                                style={styles.subtitle}
                            >
                                Enter your new email
                                address. A verification
                                link will be sent to it.
                            </Text>
                        </View>

                        <View
                            style={styles.form}
                        >
                            <Controller
                                control={control}
                                name="new_email"
                                rules={{
                                    required:
                                        "New email is required.",
                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                                        placeholder="New email address"
                                        value={value}
                                        onChangeText={
                                            onChange
                                        }
                                        onBlur={
                                            onBlur
                                        }
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={
                                            errors
                                                .new_email
                                                ?.message
                                        }
                                    />
                                )}
                            />

                            {changeEmailError && (
                                <Text
                                    style={
                                        styles.formError
                                    }
                                >
                                    {
                                        changeEmailError
                                    }
                                </Text>
                            )}
                        </View>

                        <View
                            style={
                                styles.buttonContainer
                            }
                        >
                            <AuthButton
                                title="Send Verification Email"
                                loading={loading}
                                onPress={handleSubmit(
                                    handleChangeEmail
                                )}
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

    formError: {
        color: "#C62828",
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
    },

    buttonContainer: {
        marginTop: 24,
    },
});