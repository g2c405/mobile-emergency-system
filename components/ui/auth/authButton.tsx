
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
    const isDisabled = disabled || loading;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && !isDisabled && styles.buttonPressed,
                isDisabled && styles.buttonDisabled,
            ]}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isDisabled && styles.textDisabled,
                    ]}
                >
                    {title}
                </Text>
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
        backgroundColor: "#BDBDBD",
    },

    text: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    textDisabled: {
        color: "#F5F5F5",
    },
});
