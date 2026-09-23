import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";
export default function CameraScreen(){
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [mode, setMode] = useState<"picture" | "video">("picture");
    const [recording, setRecording] = useState(false);
    if (!permission) {
        return <View />;
    }
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text>
                    Camera permission is required.
                </Text>

                <Button
                    title="Allow Camera"
                    onPress={requestPermission}
                />
            </View>
        );
    }

    async function takePhoto(){
        if(!cameraRef.current){
            return;
        }
        try{
            const result = await cameraRef.current.takePictureAsync({quality: 1});
            if(!result){
                return;
            }
            router.replace({
                pathname: "/(tabs)/report",
                params: {
                    mediaUri: result.uri,
                    mediaType: "image",
                },
            });
            console.log("CAMERA PHOTO: ", result.uri);
        }
        catch(error){
            console.error("CAMERA ERROR: ", error);
            Alert.alert(
                "Camera error",
                "Unable to take photo."
            );
        }
    }
    
    async function recordVideo(){
        if(!cameraRef.current){
            return;
        }

        if(!microphonePermission?.granted){
            const permission = await requestMicrophonePermission();
            if(!permission.granted){
                Alert.alert(
                    "Microphone permission required",
                    "Microphone access is required to record video."
                );
                return;
            }
        }

        try{
            setRecording(true);
            const result = await cameraRef.current.recordAsync({
                maxDuration: 30,
                maxFileSize: 50 * 1024 * 1024,
            });
            if(!result){
                return;
            }
            router.replace({
                pathname: "/(tabs)/report",
                params: {
                    mediaUri: result.uri,
                    mediaType: "video",
                },
            });
            console.log("CAMERA VIDEO: ", result.uri);
        }
        catch(error){
            console.error("VIDEO ERROR: ", error);
            Alert.alert(
                "Video error",
                "Unable to record video."
            );
        }
        finally{
            setRecording(false);
        }
    }
    function stopRecording(){
        cameraRef?.current?.stopRecording();
    }
    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
                mode={mode}
                videoQuality="1080p"
                videoBitrate={8_000_000}
            />
            <View style={styles.controls}>
                <View style={styles.modeButtons}>
                    <TouchableOpacity
                        onPress={() => setMode("picture")}
                    >
                        <Text style={styles.modeText}>
                            Photo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMode("video")}
                    >
                        <Text style={styles.modeText}>
                            Video
                        </Text>
                    </TouchableOpacity>
                </View>

                {mode === "picture" ? (
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePhoto}
                    >
                        <Text style={styles.captureText}>
                            Take Photo
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={
                            recording
                                ? stopRecording
                                : recordVideo
                        }
                    >
                        <Text style={styles.captureText}>
                            {recording
                                ? "Stop Recording"
                                : "Record Video"}
                        </Text>
                    </TouchableOpacity>
                )}

                <Button
                    title="Cancel"
                    onPress={() => router.back()}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    camera: {
        flex: 1,
    },

    controls: {
        padding: 20,
        gap: 15,
    },

    modeButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    modeText: {
        fontSize: 18,
    },

    captureButton: {
        padding: 15,
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
    },

    captureText: {
        fontSize: 18,
    },

    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
});