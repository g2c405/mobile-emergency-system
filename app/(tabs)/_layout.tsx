import { useAuth } from "@/hooks/useAuth";
import { getNotifications } from "@/services/notificationService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Tabs } from "expo-router";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function TabLayout() {
    const { user, initializing } = useAuth();

    const {
        data: notifications = [],
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        enabled: !!user,
    });

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    if (initializing) {
        return null;
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#C62828",
                tabBarInactiveTintColor: "#888888",
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "document-text"
                                    : "document-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="report"
                options={{
                    title: "Report",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "add-circle"
                                    : "add-circle-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.notificationIcon}>
                            <Ionicons
                                name={
                                    focused
                                        ? "notifications"
                                        : "notifications-outline"
                                }
                                size={24}
                                color={color}
                            />

                            {unreadCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text
                                        style={
                                            styles.notificationBadgeText
                                        }
                                    >
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "person"
                                    : "person-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    notificationIcon: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },

    notificationBadge: {
        position: "absolute",
        top: -5,
        right: -7,
        minWidth: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: "#C62828",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
    },

    notificationBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
        lineHeight: 12,
    },
});