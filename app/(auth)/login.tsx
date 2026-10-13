import LegalLinks from "@/components/legal/legalLinks";
import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import { useAuth } from "@/hooks/useAuth";
import { handleApiError } from "@/services/apiError";
import { LoginRequest } from "@/types/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const [loginError, setLoginError] = useState<string | null>(null);
    const { loading, login } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    async function handleLogin(data: LoginRequest) {
        setLoginError(null);

        try {
            await login(data);
        } catch (error: any) {
            handleApiError(error);

            if (error.response?.status === 403) {
                setLoginError(
                    error.response.data?.detail ||
                        "Please verify your email before logging in."
                );
                return;
            }

            if (error.response?.status === 401) {
                setLoginError(
                    error.response.data?.detail ||
                        "Invalid username or password."
                );
                return;
            }

            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);
            console.error("MESSAGE:", error.message);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.heading}>
                    Sign in to your Account
                </Text>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="username"
                        rules={{
                            required: "Username is required",
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
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

                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "Password is required",
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AuthInput
                                placeholder="Password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry
                                error={errors.password?.message}
                            />
                        )}
                    />

                    <Pressable
                        style={styles.forgotPassword}
                        onPress={() =>
                            router.push("/(auth)/forgot-password")
                        }
                    >
                        <Text style={styles.accentText}>
                            Forgot Password?
                        </Text>
                    </Pressable>

                    {loginError && (
                        <Text style={styles.loginError}>
                            {loginError}
                        </Text>
                    )}
                </View>

                <Pressable
                    style={styles.accountLink}
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Text style={styles.accountText}>
                        Don't have an account?{" "}
                        <Text style={styles.accentText}>
                            Sign up here.
                        </Text>
                    </Text>
                </Pressable>

                <AuthButton
                    title="Sign in"
                    loading={loading}
                    onPress={handleSubmit(handleLogin)}
                />

                <LegalLinks
                    layout="row"
                    containerStyle={styles.legalLinks}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 40,
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

    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: -6,
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

    loginError: {
        color: "#C62828",
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
    },

    legalLinks: {
        marginTop: 18,
    },
});
