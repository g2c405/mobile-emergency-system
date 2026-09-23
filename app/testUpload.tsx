import { uploadMedia } from "@/services/storageService";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";

export default function TestUploadScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handlePickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];
            if (asset.type !== "image" && asset.type !== "video") {
            Alert.alert(
                "Unsupported media",
                "Please select an image or video."
            );
            return;
        }
        console.log("ASSET:", asset);
        console.log("MEDIA TYPE:", asset.type);
        console.log("MIME TYPE:", asset.mimeType);

        setImageUri(asset.uri);

        try {
            setLoading(true);

            const path = await uploadMedia(
                asset.uri,
                asset.type
            );

            setUploadedPath(path);

            Alert.alert(
                "Upload successful",
                `Stored at:\n${path}`
            );
        } catch (error) {
            console.error("UPLOAD ERROR:", error);

            Alert.alert(
                "Upload failed",
                "Something went wrong while uploading."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 20 }}>
            <Button
                title={loading ? "Uploading..." : "Pick & Upload Image"}
                onPress={handlePickImage}
                disabled={loading}
            />

            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{
                        width: 300,
                        height: 300,
                        alignSelf: "center",
                    }}
                />
            )}

            {uploadedPath && (
                <Text>
                    Uploaded path:
                    {"\n"}
                    {uploadedPath}
                </Text>
            )}
        </View>
    );
}
