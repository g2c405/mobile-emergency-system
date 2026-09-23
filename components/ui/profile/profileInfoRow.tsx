import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface ProfileInfoRowProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    last?: boolean;
}

export default function ProfileInfoRow({
    icon,
    label,
    value,
    last = false,
}: ProfileInfoRowProps) {
    return (
        <View
            style={[
                styles.row,
                !last && styles.rowBorder,
            ]}
        >
            <View style={styles.left}>
                <Ionicons
                    name={icon}
                    size={19}
                    color="#777777"
                />

                <Text style={styles.label}>
                    {label}
                </Text>
            </View>

            <Text
                style={styles.value}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
    },

    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
    },

    label: {
        fontSize: 14,
        color: "#777777",
    },

    value: {
        flex: 1,
        fontSize: 15,
        color: "#222222",
        textAlign: "right",
        fontWeight: "500",
    },
});