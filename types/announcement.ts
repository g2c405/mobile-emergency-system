
export interface Announcement {
    id: number;
    admin: number;
    title: string;
    content: string;
    barangay: string;
    media: string;
    media_thumbnail: string;
    image_url: string | null;
    video_thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface AnnouncementVideoUrlResponse {
    video_url: string | null;
}
