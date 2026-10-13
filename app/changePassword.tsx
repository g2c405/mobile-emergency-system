import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import { changePassword } from "@/services/authService";
import { ChangePasswordRequest } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
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
    View,
} from "react-native";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

interface ChangePasswordForm
    extends ChangePasswordRequest {
    confirm_password: string;
}

export default function ChangePasswordScreen() {
    const [loading, setLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] =
        useState<string | null>(null);

    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordForm>({
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const newPassword = watch("new_password", "");

    async function handleChangePassword(
        data: ChangePasswordForm
    ) {
        setLoading(true);
        setChangePasswordError(null);

        try {
            await changePassword({
                current_password:
                    data.current_password,
                new_password:
                    data.new_password,
            });

            // Refresh notifications after the password change succeeds.
            await queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            router.back();
        } catch (error: any) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                error.response?.data ?? error
            );

            const backendErrors =
                error.response?.data;

            if (
                backendErrors?.current_password
            ) {
                setError("current_password", {
                    type: "server",
                    message:
                        backendErrors
                            .current_password[0],
                });
            }

            if (
                backendErrors?.new_password
            ) {
                setError("new_password", {
                    type: "server",
                    message:
                        backendErrors
                            .new_password[0],
                });
            }

            if (
                !backendErrors?.current_password &&
                !backendErrors?.new_password
            ) {
                setChangePasswordError(
                    "Failed to change your password. Please try again."
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
                                Change Password
                            </Text>

                            <Text
                                style={styles.subtitle}
                            >
                                Update your password
                                to keep your
                                account secure.
                            </Text>
                        </View>

                        <View
                            style={styles.form}
                        >
                            {/* Current Password */}
                            <Controller
                                control={control}
                                name="current_password"
                                rules={{
                                    required:
                                        "Current password is required.",
                                }}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                    },
                                }) => (
                                    <AuthInput
                                        placeholder="Current password"
                                        value={value}
                                        onChangeText={
                                            onChange
                                        }
                                        onBlur={
                                            onBlur
                                        }
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={
                                            errors
                                                .current_password
                                                ?.message
                                        }
                                    />
                                )}
                            />

                            {/* New Password */}
                            <Controller
                                control={control}
                                name="new_password"
                                rules={{
                                    required:
                                        "New password is required.",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters.",
                                    },
                                    maxLength: {
                                        value: 24,
                                        message:
                                            "Password must not exceed 24 characters.",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
                                        message:
                                            "Password must contain uppercase, lowercase, number, and special character.",
                                    },
                                    validate: (
                                        value,
                                        formValues
                                    ) =>
                                        value !==
                                            formValues.current_password ||
                                        "New password must be different from your current password.",
                                }}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                    },
                                }) => (
                                    <AuthInput
                                        placeholder="New password"
                                        value={value}
                                        onChangeText={
                                            onChange
                                        }
                                        onBlur={
                                            onBlur
                                        }
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={
                                            errors
                                                .new_password
                                                ?.message
                                        }
                                    />
                                )}
                            />

                            {/* Password Requirements */}
                            <View
                                style={
                                    styles.passwordRequirements
                                }
                            >
                                <Text
                                    style={
                                        styles.requirementsTitle
                                    }
                                >
                                    Password must:
                                </Text>

                                <Text
                                    style={
                                        newPassword.length >=
                                            8 &&
                                        newPassword.length <=
                                            24
                                            ? styles.requirementValid
                                            : styles.requirement
                                    }
                                >
                                    {newPassword.length >=
                                        8 &&
                                    newPassword.length <=
                                        24
                                        ? "✓"
                                        : "•"}{" "}
                                    8-24 characters
                                </Text>

                                <Text
                                    style={
                                        /[A-Z]/.test(
                                            newPassword
                                        )
                                            ? styles.requirementValid
                                            : styles.requirement
                                    }
                                >
                                    {/[A-Z]/.test(
                                        newPassword
                                    )
                                        ? "✓"
                                        : "•"}{" "}
                                    At least one uppercase
                                    letter
                                </Text>

                                <Text
                                    style={
                                        /[a-z]/.test(
                                            newPassword
                                        )
                                            ? styles.requirementValid
                                            : styles.requirement
                                    }
                                >
                                    {/[a-z]/.test(
                                        newPassword
                                    )
                                        ? "✓"
                                        : "•"}{" "}
                                    At least one lowercase
                                    letter
                                </Text>

                                <Text
                                    style={
                                        /\d/.test(
                                            newPassword
                                        )
                                            ? styles.requirementValid
                                            : styles.requirement
                                    }
                                >
                                    {/\d/.test(
                                        newPassword
                                    )
                                        ? "✓"
                                        : "•"}{" "}
                                    At least one number
                                </Text>

                                <Text
                                    style={
                                        /[^A-Za-z0-9]/.test(
                                            newPassword
                                        )
                                            ? styles.requirementValid
                                            : styles.requirement
                                    }
                                >
                                    {/[^A-Za-z0-9]/.test(
                                        newPassword
                                    )
                                        ? "✓"
                                        : "•"}{" "}
                                    At least one special
                                    character
                                </Text>
                            </View>

                            {/* Confirm New Password */}
                            <Controller
                                control={control}
                                name="confirm_password"
                                rules={{
                                    required:
                                        "Please confirm your new password.",
                                    validate: (
                                        value,
                                        formValues
                                    ) =>
                                        value ===
                                            formValues.new_password ||
                                        "Passwords do not match.",
                                }}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                    },
                                }) => (
                                    <AuthInput
                                        placeholder="Confirm new password"
                                        value={value}
                                        onChangeText={
                                            onChange
                                        }
                                        onBlur={
                                            onBlur
                                        }
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={
                                            errors
                                                .confirm_password
                                                ?.message
                                        }
                                    />
                                )}
                            />

                            {changePasswordError && (
                                <Text
                                    style={
                                        styles.formError
                                    }
                                >
                                    {
                                        changePasswordError
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
                                title="Change Password"
                                loading={loading}
                                onPress={handleSubmit(
                                    handleChangePassword
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

    passwordRequirements: {
        marginTop: -8,
        marginLeft: 4,
    },

    requirementsTitle: {
        fontSize: 13,
        color: "#666666",
        marginBottom: 4,
    },

    requirement: {
        fontSize: 12,
        color: "#888888",
        marginBottom: 2,
    },

    requirementValid: {
        fontSize: 12,
        color: "#2E7D32",
        marginBottom: 2,
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
