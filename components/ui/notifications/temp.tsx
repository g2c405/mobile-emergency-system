import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Notification } from "@/types/notification";

interface NotificationCardProps {
    notification: Notification;
    onPress: () => void;
}

export default function NotificationCard({
    notification,
    onPress,
}: NotificationCardProps) {
    const { icon, iconBackground } =
        getNotificationStyle(
            notification.notification_type
        );

    const formattedDate = new Date(
        notification.created_at
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const formattedTime = new Date(
        notification.created_at
    ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                !notification.is_read &&
                    styles.unreadCard,
                pressed && styles.pressed,
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor:
                            iconBackground,
                    },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={22}
                    color="#333333"
                />
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        style={[
                            styles.title,
                            !notification.is_read &&
                                styles.unreadTitle,
                        ]}
                        numberOfLines={1}
                    >
                        {notification.title}
                    </Text>

                    {!notification.is_read && (
                        <View
                            style={styles.unreadDot}
                        />
                    )}
                </View>

                <Text
                    style={styles.message}
                    numberOfLines={2}
                >
                    {notification.message}
                </Text>

                <Text style={styles.date}>
                    {formattedDate} • {formattedTime}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={20}
                color="#AAAAAA"
            />
        </Pressable>
    );
}

function getNotificationStyle(
    type: Notification["notification_type"]
) {
    switch (type) {
        case "report_update":
            return {
                icon: "document-text-outline" as const,
                iconBackground: "#F2F2F2",
            };

        case "admin_announcement":
            return {
                icon: "megaphone-outline" as const,
                iconBackground: "#F2F2F2",
            };

        case "user_warning":
            return {
                icon: "warning-outline" as const,
                iconBackground: "#F2F2F2",
            };

        default:
            return {
                icon: "notifications-outline" as const,
                iconBackground: "#F2F2F2",
            };
    }
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5E5",

        padding: 14,
        marginBottom: 10,

        gap: 12,
    },

    unreadCard: {
        borderColor: "#D9D9D9",
        backgroundColor: "#FCFCFC",
    },

    pressed: {
        opacity: 0.7,
    },

    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,
    },

    content: {
        flex: 1,
        gap: 4,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    title: {
        flex: 1,

        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
    },

    unreadTitle: {
        fontWeight: "700",
        color: "#222222",
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C62828",
    },

    message: {
        fontSize: 14,
        lineHeight: 19,
        color: "#666666",
    },

    date: {
        fontSize: 12,
        color: "#999999",
        marginTop: 2,
    },
});