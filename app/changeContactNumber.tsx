import AuthButton from "@/components/ui/auth/authButton";
import AuthInput from "@/components/ui/auth/authInput";
import { useAuth } from "@/hooks/useAuth";
import { changeContactNumber } from "@/services/authService";
import { ChangeContactNumberRequest } from "@/types/auth";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
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

interface ChangeContactNumberForm extends ChangeContactNumberRequest {}

export default function ChangeContactNumberScreen() {
    const [loading, setLoading] = useState(false);
    const [changeContactNumberError, setChangeContactNumberError] =
        useState<string | null>(null);

    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ChangeContactNumberForm>({
        defaultValues: {
            contact_number: user?.contact_number ?? "",
        },
    });

    async function handleChangeContactNumber(
        data: ChangeContactNumberForm
    ) {
        setLoading(true);
        setChangeContactNumberError(null);

        try {
            await changeContactNumber({
                contact_number: data.contact_number,
            });

            if (user) {
                updateUser({
                    ...user,
                    contact_number: data.contact_number,
                });
            }

            // Refresh notifications after the account change succeeds.
            await queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            Alert.alert(
                "Contact Number Updated",
                "Your contact number has been updated successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            console.error(
                "CHANGE CONTACT NUMBER ERROR:",
                error.response?.data ?? error
            );

            const backendErrors = error.response?.data;

            if (backendErrors?.contact_number) {
                setError("contact_number", {
                    type: "server",
                    message: backendErrors.contact_number[0],
                });
            }

            if (!backendErrors?.contact_number) {
                setChangeContactNumberError(
                    "Failed to change your contact number. Please try again."
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
                                Change Contact Number
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter your new contact number.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Controller
                                control={control}
                                name="contact_number"
                                rules={{
                                    required:
                                        "Contact number is required.",
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
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        error={
                                            errors.contact_number?.message
                                        }
                                    />
                                )}
                            />

                            {changeContactNumberError && (
                                <Text style={styles.formError}>
                                    {changeContactNumberError}
                                </Text>
                            )}
                        </View>

                        <View style={styles.buttonContainer}>
                            <AuthButton
                                title="Save Changes"
                                loading={loading}
                                onPress={handleSubmit(
                                    handleChangeContactNumber
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
