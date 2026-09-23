import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
} from "react-native";

interface AuthButtonProps extends Omit<PressableProps, "style"> {
    title: string;
    loading?: boolean;
}

export default function AuthButton({
    title,
    loading = false,
    disabled,
    ...props
}: AuthButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 54,
        backgroundColor: "#C62828",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonPressed: {
        opacity: 0.8,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
