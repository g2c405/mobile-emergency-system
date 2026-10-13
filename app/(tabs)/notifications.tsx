import NotificationCard from "@/components/ui/notifications/temp";
import { getNotifications, markAsRead } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient, } from "@tanstack/react-query";
import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NotificationsScreen() {
    const queryClient = useQueryClient();
    const {
        data: notifications = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    console.log(
        "NOTIFICATIONS QUERY DATA:",
        notifications
    );

    async function handleNotificationPress(notification: Notification) {
        if (!notification.is_read) {
            queryClient.setQueryData<Notification[]>(
                ["notifications"],
                (old = []) =>
                    old.map((item) =>
                        item.id === notification.id
                            ? {
                                ...item,
                                is_read: true,
                            }
                            : item
                    )
            );

            // Update the backend in the background
            markAsRead(notification.id).catch(
                (error) => {
                    console.error(
                        "Failed to mark notification as read:",
                        error
                    );
                }
            );
        }
        switch (notification.notification_type) {
            case "report_update":
                if (notification.report) {
                    router.push(
                        `/report/${notification.report}`
                    );
                }
                break;

           case "admin_announcement":
            if (notification.announcement) {
                router.push(
                    `/announcement/${notification.announcement}`
                );
            }
            break;
            case "user_warning":
                router.push(`/notification/${notification.id}`);
                break;

        }
    }

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (isError) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>
                    Failed to load notifications.
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.heading}>
                        Notifications
                    </Text>

                    <Text style={styles.subtitle}>
                        Stay updated on your reports
                        and announcements.
                    </Text>
                </View>

                <FlatList
                    data={notifications}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={({ item }) => (
                        <NotificationCard
                            notification={item}
                            onPress={() =>
                                handleNotificationPress(
                                    item
                                )
                            }
                        />
                    )}
                    contentContainerStyle={
                        styles.listContent
                    }
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={false}
                    ListEmptyComponent={
                        <View
                            style={styles.emptyContainer}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={48}
                                color="#AAAAAA"
                            />

                            <Text
                                style={styles.emptyTitle}
                            >
                                No notifications yet
                            </Text>

                            <Text
                                style={styles.emptyText}
                            >
                                You're all caught up!
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    header: {
        marginBottom: 20,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222222",
    },

    subtitle: {
        fontSize: 14,
        color: "#888888",
        marginTop: 5,
    },

    listContent: {
        paddingBottom: 20,
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 60,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333333",
        marginTop: 14,
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 14,
        color: "#888888",
        textAlign: "center",
    },
});