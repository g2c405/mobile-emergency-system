import LegalLinks from "@/components/legal/legalLinks";
import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import BarangaySelectModal from "@/components/ui/generic/barangaySelect";

import { useAuth } from "@/hooks/useAuth";
import { handleApiError } from "@/services/apiError";
import { RegisterFormData } from "@/types/auth";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [loginError, setLoginError] =
        useState<string | null>(null);

    const [barangayVisible, setBarangayVisible] =
        useState(false);

    const [agreedToLegal, setAgreedToLegal] =
        useState(false);

    const { loading, register } = useAuth();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const password = watch("password", "");

    async function handleRegister(data: RegisterFormData) {
        // Guard against registration without legal agreement.
        if (!agreedToLegal || loading) {
            return;
        }

        try {
            const { confirm_password, ...registerData } = data;

            await register(registerData);

            Alert.alert(
                "Registration Successful",
                "A verification email has been sent to your email address. Please check your inbox and verify your account before logging in.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            handleApiError(error);

            console.error(
                "STATUS:",
                error.response?.status
            );
            console.error(
                "DATA:",
                error.response?.data
            );
            console.error("MESSAGE:", error.message);
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
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.heading}>
                        Create your Account
                    </Text>

                    <View style={styles.form}>
                        {/* Username */}
                        <Controller
                            control={control}
                            name="username"
                            rules={{
                                required: "Username is required",
                            }}
                            render={({
                                field: {
                                    onChange,
                                    onBlur,
                                    value,
                                },
                            }) => (
                                <AuthInput
                                    placeholder="Username"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    error={errors.username?.message}
                                />
                            )}
                        />

                        {/* Email */}
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: "Email is required",
                            }}
                            render={({
                                field: {
                                    onChange,
                                    onBlur,
                                    value,
                                },
                            }) => (
                                <AuthInput
                                    placeholder="Email"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    error={errors.email?.message}
                                />
                            )}
                        />

                        {/* First and Last Name */}
                        <View style={styles.nameRow}>
                            <View style={styles.nameInput}>
                                <Controller
                                    control={control}
                                    name="first_name"
                                    rules={{
                                        required:
                                            "Firstname is required",
                                    }}
                                    render={({
                                        field: {
                                            onChange,
                                            onBlur,
                                            value,
                                        },
                                    }) => (
                                        <AuthInput
                                            placeholder="Firstname"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCorrect={false}
                                            error={
                                                errors.first_name
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            </View>

                            <View style={styles.nameInput}>
                                <Controller
                                    control={control}
                                    name="last_name"
                                    rules={{
                                        required:
                                            "Lastname is required",
                                    }}
                                    render={({
                                        field: {
                                            onChange,
                                            onBlur,
                                            value,
                                        },
                                    }) => (
                                        <AuthInput
                                            placeholder="Lastname"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCorrect={false}
                                            error={
                                                errors.last_name
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            </View>
                        </View>

                        {/* Contact Number */}
                        <Controller
                            control={control}
                            name="contact_number"
                            rules={{
                                required:
                                    "Contact number is required",
                                pattern: {
                                    value: /^09\d{9}$/,
                                    message:
                                        "Enter a valid 11-digit number starting with 09",
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
                                    placeholder="Contact number"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="phone-pad"
                                    autoCorrect={false}
                                    error={
                                        errors.contact_number?.message
                                    }
                                />
                            )}
                        />

                        {/* Residential Barangay */}
                        <Controller
                            control={control}
                            name="residential_barangay"
                            rules={{
                                required: "Barangay is required",
                            }}
                            render={({
                                field: { onChange, value },
                            }) => (
                                <>
                                    <Pressable
                                        style={[
                                            styles.barangaySelector,
                                            errors.residential_barangay &&
                                                styles.inputError,
                                        ]}
                                        onPress={() =>
                                            setBarangayVisible(true)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.barangayText,
                                                !value &&
                                                    styles.placeholder,
                                            ]}
                                        >
                                            {value ??
                                                "Select barangay"}
                                        </Text>

                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#888888"
                                        />
                                    </Pressable>

                                    {errors.residential_barangay && (
                                        <Text style={styles.error}>
                                            {
                                                errors
                                                    .residential_barangay
                                                    .message
                                            }
                                        </Text>
                                    )}

                                    <BarangaySelectModal
                                        visible={barangayVisible}
                                        value={value}
                                        onSelect={(barangay) => {
                                            if (barangay) {
                                                onChange(barangay);
                                            }
                                        }}
                                        onClose={() =>
                                            setBarangayVisible(false)
                                        }
                                    />
                                </>
                            )}
                        />

                        {/* Password */}
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters",
                                },
                                maxLength: {
                                    value: 24,
                                    message:
                                        "Password must not exceed 24 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
                                    message:
                                        "Password must contain uppercase, lowercase, number, and special character",
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
                                    placeholder="Password"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    error={errors.password?.message}
                                />
                            )}
                        />

                        {/* Password Requirements */}
                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementsTitle}>
                                Password must:
                            </Text>

                            <Text
                                style={
                                    password.length >= 8 &&
                                    password.length <= 24
                                        ? styles.requirementValid
                                        : styles.requirement
                                }
                            >
                                {password.length >= 8 &&
                                password.length <= 24
                                    ? "✓"
                                    : "•"}{" "}
                                8-24 characters
                            </Text>

                            <Text
                                style={
                                    /[A-Z]/.test(password)
                                        ? styles.requirementValid
                                        : styles.requirement
                                }
                            >
                                {/[A-Z]/.test(password)
                                    ? "✓"
                                    : "•"}{" "}
                                At least one uppercase letter
                            </Text>

                            <Text
                                style={
                                    /[a-z]/.test(password)
                                        ? styles.requirementValid
                                        : styles.requirement
                                }
                            >
                                {/[a-z]/.test(password)
                                    ? "✓"
                                    : "•"}{" "}
                                At least one lowercase letter
                            </Text>

                            <Text
                                style={
                                    /\d/.test(password)
                                        ? styles.requirementValid
                                        : styles.requirement
                                }
                            >
                                {/\d/.test(password)
                                    ? "✓"
                                    : "•"}{" "}
                                At least one number
                            </Text>

                            <Text
                                style={
                                    /[^A-Za-z0-9]/.test(password)
                                        ? styles.requirementValid
                                        : styles.requirement
                                }
                            >
                                {/[^A-Za-z0-9]/.test(password)
                                    ? "✓"
                                    : "•"}{" "}
                                At least one special character
                            </Text>
                        </View>

                        {/* Confirm Password */}
                        <Controller
                            control={control}
                            name="confirm_password"
                            rules={{
                                required:
                                    "Please confirm your password",
                                validate: (
                                    value,
                                    formValues
                                ) =>
                                    value === formValues.password ||
                                    "Passwords do not match",
                            }}
                            render={({
                                field: {
                                    onChange,
                                    onBlur,
                                    value,
                                },
                            }) => (
                                <AuthInput
                                    placeholder="Confirm password"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    error={
                                        errors.confirm_password
                                            ?.message
                                    }
                                />
                            )}
                        />

                        {loginError && (
                            <Text style={styles.loginError}>
                                {loginError}
                            </Text>
                        )}
                    </View>

                    {/* Existing Sign In Link */}
                    <Pressable
                        style={styles.accountLink}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.accountText}>
                            Already have an account?{" "}
                            <Text style={styles.accentText}>
                                Sign in here.
                            </Text>
                        </Text>
                    </Pressable>

                    {/* Legal Agreement */}
                    <View style={styles.legalContainer}>
                        <Pressable
                            style={styles.agreementRow}
                            onPress={() =>
                                setAgreedToLegal((previous) => !previous)
                            }
                            accessibilityRole="checkbox"
                            accessibilityState={{
                                checked: agreedToLegal,
                            }}
                            accessibilityLabel="Agree to the Terms and Conditions and acknowledge the Privacy Policy"
                            hitSlop={4}
                        >
                            <Ionicons
                                name={
                                    agreedToLegal
                                        ? "checkbox"
                                        : "square-outline"
                                }
                                size={23}
                                color={
                                    agreedToLegal
                                        ? "#2E7D32"
                                        : "#888888"
                                }
                            />

                            <Text style={styles.agreementText}>
                                I agree to the Terms and Conditions
                                and acknowledge the Privacy Policy.
                            </Text>
                        </Pressable>

                        <LegalLinks
                            layout="row"
                            containerStyle={styles.legalLinks}
                        />

                        {!agreedToLegal && (
                            <Text style={styles.legalHint}>
                                Please agree to continue with registration.
                            </Text>
                        )}
                    </View>

                    {/* Sign Up */}
                    <View style={styles.signUpButton}>
                        <AuthButton
                            title="Sign up"
                            loading={loading}
                            disabled={!agreedToLegal || loading}
                            onPress={handleSubmit(handleRegister)}
                        />
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

    container: {
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 30,
    },

    logo: {
        width: 150,
        height: 150,
        alignSelf: "center",
        marginBottom: 20,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "#222222",
        marginBottom: 40,
    },

    form: {
        width: "100%",
        gap: 16,
    },

    nameRow: {
        flexDirection: "row",
        gap: 4,
    },

    nameInput: {
        flex: 1,
    },

    barangaySelector: {
        height: 52,
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#E9E9E7",
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    barangayText: {
        fontSize: 15,
        color: "#333333",
    },

    placeholder: {
        color: "#999999",
    },

    inputError: {
        borderWidth: 1,
        borderColor: "#C62828",
    },

    error: {
        color: "#C62828",
        fontSize: 13,
        marginTop: 4,
        marginLeft: 4,
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

    loginError: {
        color: "#C62828",
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
    },

    accountLink: {
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 18,
        paddingVertical: 6,
    },

    accountText: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },

    accentText: {
        color: "#C62828",
        fontWeight: "600",
    },

    legalContainer: {
        marginTop: 4,
        marginBottom: 20,
    },

    agreementRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },

    agreementText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
        color: "#444444",
    },

    legalLinks: {
        marginTop: 10,
    },

    legalHint: {
        fontSize: 11,
        lineHeight: 16,
        color: "#888888",
        textAlign: "center",
        marginTop: 8,
    },

    signUpButton: {
        marginTop: 4,
    },
});
