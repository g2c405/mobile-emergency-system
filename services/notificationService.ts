import { Notification } from "@/types/notification";
import api from "./api";
export async function getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
        "notifications/"
    );
    console.log("===== NOTIFICATIONS =====");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    console.log(
        "IS ARRAY:",
        Array.isArray(response.data)
    )
    return response.data;
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