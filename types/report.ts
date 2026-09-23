export interface Report{
    id: number,
    user: number
    latitude: number,
    longitude: number,
    barangay: string,
    city: string,
    description: string,
    media: string,
    image_url: string | null;
    media_thumbnail: string | null;
    video_thumbnail_url: string | null,
    status: ReportStatus,
    created_at: string

}

export interface ReportRequest{
    latitude: number,
    longitude: number,
    barangay: string
    description: string,

}

export interface NearestBarangayResponse {
    barangay: string;
    distance_km: number;
}

export interface VideoUrlResponse {
    video_url: string | null;
}

export type MediaType = "image" | "video";
export type MediaRole = "media" | "thumbnail";

export type ReportStatus =  | "pending" | "ongoing" | "resolved";

interface ReportFiltersProps {
    sortOrder: "newest" | "oldest";

    selectedStatuses: ReportStatus[];

    mediaType: "all" | "image" | "video";

    selectedBarangay: string | null;

    onSortChange: (
        value: "newest" | "oldest"
    ) => void;

    onStatusChange: (
        value: ReportStatus[]
    ) => void;

    onMediaTypeChange: (
        value: "all" | "image" | "video"
    ) => void;

    onBarangayChange: (
        value: string | null
    ) => void;
}