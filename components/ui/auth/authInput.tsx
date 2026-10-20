
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface AuthInputPorps extends TextInputProps {
    error?: string;
}

export default function AuthInput({
    error,
    style,
    secureTextEntry,
    ...props
}: AuthInputPorps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry === true;

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    {...props}
                    style={[
                        styles.input,
                        error && styles.inputError,
                        style,
                    ]}
                    placeholderTextColor="#8A8A8A"
                    autoCapitalize="none"
                    secureTextEntry={
                        isPassword && !showPassword
                    }
                    
                />

                {isPassword && (
                    <Pressable
                        style={styles.toggle}
                        onPress={() =>
                            setShowPassword(!showPassword)
                        }
                        hitSlop={8}
                    >
                        <Text style={styles.toggleText}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </Pressable>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },

    inputContainer: {
        position: "relative",
    },

    input: {
        height: 54,
        backgroundColor: "#E9E9E7",
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingRight: 65,
        fontSize: 15,
        color: "#202020",
    },

    inputError: {
        borderWidth: 1,
        borderColor: "#C62828",
    },

    toggle: {
        position: "absolute",
        right: 16,
        top: 0,
        height: 54,
        justifyContent: "center",
    },

    toggleText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#C62828",
    },

    errorText: {
        marginTop: 5,
        marginLeft: 4,
        fontSize: 12,
        color: "#C62828",
    },
});
