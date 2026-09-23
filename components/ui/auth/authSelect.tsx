import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

interface AuthSelectOption {
    label: string;
    value: string;
}

interface AuthSelectProps {
    placeholder: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: AuthSelectOption[];
    error?: string;
    enabled?: boolean;
}

export default function AuthSelect({
    placeholder,
    value,
    onValueChange,
    options,
    error,
    enabled = true,
}: AuthSelectProps) {
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputError,
                ]}
            >
                <Picker
                    selectedValue={value ?? ""}
                    onValueChange={(itemValue) => {
                        if (itemValue !== "") {
                            onValueChange(itemValue);
                        }
                    }}
                    enabled={enabled}
                    style={styles.picker}
                >
                    <Picker.Item
                        label={placeholder}
                        value=""
                        color="#999999"
                    />

                    {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                        />
                    ))}
                </Picker>
            </View>

            {error && (
                <Text style={styles.error}>
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
        height: 52,
        width: "100%",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 10,
        backgroundColor: "#E9E9E7",
        justifyContent: "center",
        overflow: "hidden",
    },

    inputError: {
        borderColor: "#C62828",
    },

    picker: {
        width: "100%",
        height: 52,
    },

    error: {
        color: "#C62828",
        fontSize: 13,
        marginTop: 4,
        marginLeft: 4,
    },
});