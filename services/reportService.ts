import { NearestBarangayResponse, Report, ReportRequest, VideoUrlResponse } from "@/types/report";
import api from "./api";
export async function getReports(): Promise<Report[]>{
     try {
        const response = await api.get<Report[]>(
            "reports/user-reports/"
        );

        console.log("GET REPORTS: SUCCESS");
        console.log("STATUS:", response.status);
        console.log("COUNT:", response.data.length);

        return response.data;
    } catch (error: any) {
        console.log("GET REPORTS: FAILED");
        console.log("MESSAGE:", error.message);
        console.log("CODE:", error.code);
        console.log("STATUS:", error.response?.status);

        throw error;
    }
}

export async function getReport(id: number): Promise<Report>{
    const response  = await api.get<Report>(`reports/user-reports/${id}/`);
    return response.data;
}

export async function createReport(data: ReportRequest): Promise<Report>{
    const response = await api.post<Report>("reports/user-reports/", data);
    return response.data;
}
export async function updateReportMedia(
    id: number,
    media: string,
    mediaThumbnail?: string): Promise<Report>{
    const response = await api.patch<Report>(`reports/user-reports/${id}/`,
        {media,
            media_thumbnail: mediaThumbnail
        }
    );
    return response.data;
}
export async function getNearestBarangay( latitude: number, longitude: number): Promise<NearestBarangayResponse>{
    const response = await api.post<NearestBarangayResponse>("reports/nearest-barangay/",
        {
            latitude,
            longitude
        }
    )
    return response.data
}

export async function getReportVideoUrl(
    reportId: number
): Promise<VideoUrlResponse> {
    const response = await api.get<VideoUrlResponse>(
        `reports/user-reports/${reportId}/video-url/`
    );

    return response.data;
}