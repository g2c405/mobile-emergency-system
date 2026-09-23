import { MediaRole, MediaType } from "@/types/report";
import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import api from "./api";
interface UrlResponse {
    path: string;
    upload_url: string;
}

async function compressImage(uri: string): Promise<string> {
    const context = ImageManipulator.manipulate(uri);

    context.resize({
        width: 1600,
    });

    const image = await context.renderAsync();

    const result = await image.saveAsync({
        compress: 0.75,
        format: SaveFormat.JPEG,
    });

    return result.uri;
}

export async function uploadMedia(
    uri: string,
    type: MediaType,
    reportId: number,
    role: MediaRole = "media",
    mimeType: string
): Promise<string> {
    let uploadUri = uri;
    let uploadContentType: string;

    if (type === "image") {
        uploadUri = await compressImage(uri);
        uploadContentType = "image/jpeg";
    } else {
        uploadContentType = mimeType;
    }

    console.log("===== REQUESTING UPLOAD URL =====");
    console.log("REPORT ID:", reportId);
    console.log("MEDIA TYPE:", type);
    console.log("MEDIA ROLE:", role);
    console.log("UPLOAD CONTENT TYPE:", uploadContentType);

    const response = await api.post<UrlResponse>(
        "reports/media/upload-url/",
        {
            content_type: uploadContentType,
            report_id: reportId
        }
    );

    console.log("UPLOAD URL RESPONSE:", response.data);

    const { upload_url, path } = response.data;

    console.log("BEFORE FILE OBJECT");

    const file = new File(uploadUri);

    console.log("FILE OBJECT CREATED");

    const fileData = await file.arrayBuffer();

    console.log("ARRAY BUFFER CREATED");
    console.log("FILE SIZE:", fileData.byteLength);

    console.log("STARTING SUPABASE PUT");

    const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
            "Content-Type": uploadContentType,
        },
        body: fileData,
    });

    console.log("SUPABASE PUT FINISHED");
    console.log("STATUS:", uploadResponse.status);

    if (!uploadResponse.ok) {
        throw new Error(
            `Media upload failed. ${uploadResponse.status}`
        );
    }

    return path;
}