import { Announcement, AnnouncementVideoUrlResponse } from "@/types/announcement";
import { Notification } from "@/types/notification";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import api from "./api";
const PUSH_TOKEN_KEY = "expo_push_token";
export async function getNotifications(): Promise<Notification[]> {
    try {
        const response = await api.get<Notification[]>("notifications/");

        console.log("NOTIFICATIONS STATUS:", response.status);
        console.log("NOTIFICATIONS RESPONSE:", response.data);

        return response.data;
    } catch (error: any) {
        console.log("NOTIFICATIONS REQUEST FAILED");
        console.log("ERROR MESSAGE:", error.message);
        console.log("STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);
        console.log("REQUEST URL:", error.config?.url);

        throw error;
    }
}

export async function getNotifcation(id: number): Promise<Notification> {
    const response = await api.get<Notification>(`notifications/${id}/`);
    return response.data;
}

export async function markAsRead(id: number) {
    const response = await api.patch(`notifications/${id}/read/`,
        {
            is_read : true
        }
    );
    return response.data;
}

// Fetch one announcement by its ID.
export async function getAnnouncement(
    id: number
): Promise<Announcement> {
    const response = await api.get<Announcement>(
        `announcements/${id}/`
    );

    return response.data;
}

// Fetch a playable video URL when the announcement contains video.
export async function getAnnouncementVideoUrl(
    announcementId: number
): Promise<AnnouncementVideoUrlResponse> {
    const response = await api.get<AnnouncementVideoUrlResponse>(
        `announcements/${announcementId}/video-url/`
    );

    return response.data;
}

export async function registerDeviceForPushNotifications() {
    try {
        // Push notifications require a physical device.
        if (!Device.isDevice) {
            console.log("Push notifications require a physical device.");
            return null;
        }

        // Android requires a notification channel.
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "Default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
            });
        }

        // Check notification permissions.
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } =
                await Notifications.requestPermissionsAsync();

            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Notification permission was not granted.");
            return null;
        }

        // Retrieve the EAS project ID.
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
            throw new Error("Expo project ID not found.");
        }

        const expoPushToken = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;

        console.log("EXPO PUSH TOKEN:", expoPushToken);

        // Register the device with Django.
        await api.post("notifications/devices/register/", {
            expo_push_token: expoPushToken,
            platform: Platform.OS,
        });

        // Save the token locally for logout/deactivation.
        await SecureStore.setItemAsync(
            PUSH_TOKEN_KEY,
            expoPushToken
        );

        console.log("Device successfully registered with Django.");

        return expoPushToken;

    } catch (error) {
        console.error("Push notification registration failed:", error);
        return null;
    }
}

export async function deactivatePushDevice() {
    const expoPushToken =
        await SecureStore.getItemAsync(PUSH_TOKEN_KEY);

    if (!expoPushToken) {
        return;
    }

    await api.post("notifications/devices/deactivate/", {
        expo_push_token: expoPushToken,
    });

    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);

    console.log("Push device successfully deactivated.");
}