import { getNotifcation } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const notificationId = Number(id);

    const {
        data: notification,
        isLoading,
        isError,
    } = useQuery<Notification>({
        queryKey: ["notification", notificationId],
        queryFn: () => getNotifcation(notificationId),
        enabled:
            Number.isInteger(notificationId) &&
            notificationId > 0,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        );
    }

    if (isError || !notification) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>
                    Failed to load notification.
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        Go back
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#222222"
                    />

                    <Text style={styles.backText}>
                        Notification Details
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    {notification.title}
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="notifications-outline"
                        size={18}
                        color="#666666"
                    />

                    <Text style={styles.infoText}>
                        Notification
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#666666"
                    />

                    <Text style={styles.infoText}>
                        {new Date(
                            notification.created_at
                        ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

                <Text style={styles.content}>
                    {notification.message}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 24,
    },
    backText: {
        fontSize: 15,
        color: "#444444",
        marginLeft: 2,
    },
    title: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: "#666666",
    },
    content: {
        fontSize: 16,
        lineHeight: 25,
        color: "#333333",
        marginTop: 16,
        marginBottom: 28,
    },
    errorText: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
        marginBottom: 16,
    },
});
