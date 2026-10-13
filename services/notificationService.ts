import { Announcement, AnnouncementVideoUrlResponse } from "@/types/announcement";
import { Notification } from "@/types/notification";
import api from "./api";

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
