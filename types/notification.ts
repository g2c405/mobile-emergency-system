export type NotificationType =
    | "report_update"
    | "admin_announcement"
    | "user_warning";

export interface Notification {
    id: number;
    notification_type: NotificationType;
    report: number | null;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}