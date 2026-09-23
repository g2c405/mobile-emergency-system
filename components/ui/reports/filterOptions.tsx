import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface FilterOptionProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    multiSelect?: boolean;
}

export function FilterOption({
    label,
    selected,
    onPress,
    multiSelect = false,
}: FilterOptionProps) {
    return (
        <Pressable
            onPress={onPress}
            style={styles.option}
        >
            <View
                style={[
                    multiSelect
                        ? styles.checkbox
                        : styles.radio,
                    selected &&
                        styles.selectedControl,
                ]}
            >
                {selected && (
                    <Ionicons
                        name={
                            multiSelect
                                ? "checkmark"
                                : "ellipse"
                        }
                        size={multiSelect ? 15 : 8}
                        color="#FFFFFF"
                    />
                )}
            </View>

            <Text style={styles.optionText}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    sheet: {
        maxHeight: "85%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
    },

    barangaySheet: {
        maxHeight: "80%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#D0D0D0",
        alignSelf: "center",
        marginBottom: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#222222",
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    section: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 12,
    },

    optionRow: {
        flexDirection: "row",
        gap: 24,
    },

    optionList: {
        gap: 12,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 4,
    },

    optionText: {
        fontSize: 15,
        color: "#444444",
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#BBBBBB",
        alignItems: "center",
        justifyContent: "center",
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#BBBBBB",
        alignItems: "center",
        justifyContent: "center",
    },

    selectedControl: {
        backgroundColor: "#C62828",
        borderColor: "#C62828",
    },

    barangaySelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
    },

    barangayText: {
        fontSize: 15,
        color: "#333333",
    },

    placeholder: {
        color: "#888888",
    },

    footer: {
        flexDirection: "row",
        gap: 10,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    clearButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
    },

    clearButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555555",
    },

    applyButton: {
        flex: 2,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: "#C62828",
        alignItems: "center",
    },

    applyButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    barangayOption: {
        minHeight: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    barangayOptionText: {
        fontSize: 15,
        color: "#333333",
    },
});