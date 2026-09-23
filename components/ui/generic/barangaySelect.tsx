import { BARANGAYS } from "@/constants/barangay";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface BarangaySelectModalProps {
    visible: boolean;
    value: string | null;
    onSelect: (barangay: string | null) => void;
    onClose: () => void;
    includeAllOption?: boolean;
}

export default function BarangaySelectModal({
    visible,
    value,
    onSelect,
    onClose,
    includeAllOption = false,
}: BarangaySelectModalProps) {
    function handleSelect(barangay: string | null) {
        onSelect(barangay);
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />
                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Select Barangay
                        </Text>

                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#555555"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {includeAllOption && (
                            <Pressable
                                style={styles.option}
                                onPress={() =>
                                    handleSelect(null)
                                }
                            >
                                <Text
                                    style={
                                        styles.optionText
                                    }
                                >
                                    All barangays
                                </Text>

                                {value === null && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#C62828"
                                    />
                                )}
                            </Pressable>
                        )}

                        {BARANGAYS.map((barangay) => (
                            <Pressable
                                key={barangay.value}
                                style={styles.option}
                                onPress={() =>
                                    handleSelect(
                                        barangay.value
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.optionText
                                    }
                                >
                                    {barangay.label}
                                </Text>

                                {value ===
                                    barangay.value && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#C62828"
                                    />
                                )}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    sheet: {
        height: "80%",
        maxHeight: 500,
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

    option: {
        minHeight: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    optionText: {
        fontSize: 15,
        color: "#333333",
    },
});

