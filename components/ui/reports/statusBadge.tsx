import { ReportStatus } from "@/types/report";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
interface statusBadgeProps {
    status: ReportStatus;
    style?: StyleProp<ViewStyle>;
}

export default function StatusBadge({status, style}:statusBadgeProps){
    const config = {
        pending: {
            label: "Pending",
            backgroundColor: "#FFF3CD",
            textColor: "#856404",
        },
        ongoing: {
            label: "Ongoing",
            backgroundColor: "#D1ECF1",
            textColor: "#0C5460",
        },
        resolved: {
            label: "Resolved",
            backgroundColor: "#D4EDDA",
            textColor: "#155724",
        },
    }[status];

    return(
        <View style={[styles.badge, {backgroundColor: config.backgroundColor}, style]}>
            <Text style={[styles.text, {color: config.textColor}]}>{config.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },

    text: {
        fontSize: 12,
        fontWeight: "600",
    },
});
