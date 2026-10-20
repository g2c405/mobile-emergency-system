import BarangaySelectModal from "@/components/ui/generic/barangaySelect";
import CategorySelectModal, {
    INCIDENT_CATEGORIES,
    type IncidentCategory,
} from "@/components/ui/generic/categorySelect";
import getCurrentLocation from "@/services/locationService";
import {
    createReport,
    getNearestBarangay,
    updateReportMedia,
} from "@/services/reportService";
import { uploadMedia } from "@/services/storageService";
import * as MediaLibrary from "expo-media-library";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
import {
    CameraView,
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";

import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportScreen() {
    const queryClient = useQueryClient();

    const MAX_VIDEO_DURATION = 30 * 1000;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
    const cameraRef = useRef<CameraView>(null);

    const [
        cameraPermission,
        requestCameraPermission,
    ] = useCameraPermissions();

    const [
        microphonePermission,
        requestMicrophonePermission,
    ] = useMicrophonePermissions();

    const [mode, setMode] =
        useState<"picture" | "video">("picture");

    const [recording, setRecording] =
        useState(false);

    // Tracks the elapsed time of the current video recording.
    const [recordingDuration, setRecordingDuration] =
        useState(0);

    const recordingTimerRef =
        useRef<ReturnType<typeof setInterval> | null>(
            null
        );

    const [saveToGallery, setSaveToGallery] =
        useState(false);

    const [mediaSource, setMediaSource] =
        useState<"camera" | "gallery" | null>(null);

    const [description, setDescription] =
        useState("");

    const [mediaUri, setMediaUri] =
        useState<string | null>(null);

    const [mediaType, setMediaType] =
        useState<"image" | "video" | null>(null);

    const [mediaMimeType, setMediaMimeType] =
        useState<string | null>(null);

    const [location, setLocation] =
        useState<{
            latitude: number;
            longitude: number;
        } | null>(null);

    const [locationLoading, setLocationLoading] =
        useState(false);

    // Tracks whether the most recent location attempt failed.
    const [locationError, setLocationError] =
        useState(false);

    const [barangay, setBarangay] =
        useState<string | null>(null);

    const [category, setCategory] =
    useState<IncidentCategory | null>(null);

    const [categoryVisible, setCategoryVisible] =
    useState(false);

    const [suggestedBarangay, setSuggestedBarangay] =
        useState<string | null>(null);

    const [suggestedDistance, setSuggestedDistance] =
        useState<number | null>(null);

    const [barangayVisible, setBarangayVisible] =
        useState(false);

    // Tracks whether the user has already confirmed
    // that they want to override the suggested barangay.
    const [
        barangayOverrideConfirmed,
        setBarangayOverrideConfirmed,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [mediaProcessing, setMediaProcessing] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    // Keeps the recording timer synchronized with the
    // actual recording state.
    useEffect(() => {
        if (!recording) {
            if (recordingTimerRef.current) {
                clearInterval(
                    recordingTimerRef.current
                );

                recordingTimerRef.current = null;
            }

            setRecordingDuration(0);

            return;
        }

        const startedAt = Date.now();

        setRecordingDuration(0);

        recordingTimerRef.current =
            setInterval(() => {
                const elapsed =
                    Date.now() - startedAt;

                setRecordingDuration(
                    Math.min(
                        elapsed,
                        MAX_VIDEO_DURATION
                    )
                );
            }, 250);

        return () => {
            if (recordingTimerRef.current) {
                clearInterval(
                    recordingTimerRef.current
                );

                recordingTimerRef.current = null;
            }
        };
    }, [recording]);

    function formatRecordingDuration(
        duration: number
    ) {
        const totalSeconds = Math.floor(
            duration / 1000
        );

        const minutes = Math.floor(
            totalSeconds / 60
        );

        const seconds =
            totalSeconds % 60;

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    }

    async function handleRefresh() {
        if (
            recording ||
            loading ||
            mediaProcessing ||
            locationLoading
        ) {
            return;
        }

        setRefreshing(true);

        setMode("picture");
        setDescription("");
        setMediaUri(null);
        setMediaType(null);
        setMediaMimeType(null);
        setMediaSource(null);
        setSaveToGallery(false);
        setLocation(null);
        setLocationError(false);
        setLocationLoading(false);
        setBarangay(null);
        setSuggestedBarangay(null);
        setSuggestedDistance(null);
        setBarangayVisible(false);
        setBarangayOverrideConfirmed(false);
        setRecordingDuration(0);
        setCategory(null);
        setCategoryVisible(false);

        await new Promise((resolve) =>
            setTimeout(resolve, 300)
        );

        setRefreshing(false);
    }

    async function handleGetLocation() {
        setLocationLoading(true);
        setLocationError(false);

        try {
            const result =
                await getCurrentLocation();

            const newLocation = {
                latitude: result.latitude,
                longitude: result.longitude,
            };

            setLocation(newLocation);

            console.log(
                "LOCATION SUCCESS:",
                newLocation
            );

            const nearest =
                await getNearestBarangay(
                    newLocation.latitude,
                    newLocation.longitude
                );

            console.log(
                "BARANGAY SUCCESS:",
                nearest
            );

            setSuggestedBarangay(
                nearest.barangay
            );

            setSuggestedDistance(
                nearest.distance_km
            );

            setBarangay(
                nearest.barangay
            );

            // A new location means the user is receiving
            // a new suggested barangay, so the previous
            // override confirmation no longer applies.
            setBarangayOverrideConfirmed(
                false
            );
        } catch (error: any) {
            console.error(
                "LOCATION ERROR:",
                error
            );

            setLocationError(true);

            Alert.alert(
                "Location unavailable",
                "Unable to get your current location or determine the nearest barangay."
            );
        } finally {
            setLocationLoading(false);
        }
    }

    async function takePhoto() {
        if (!cameraRef.current) {
            return;
        }

        try {
            const result =
                await cameraRef.current.takePictureAsync(
                    {
                        quality: 1,
                    }
                );

            if (!result) {
                return;
            }

            setMediaUri(result.uri);
            setMediaType("image");
            setMediaMimeType("image/jpeg");
            setMediaSource("camera");
        } catch (error) {
            console.error(
                "CAMERA ERROR:",
                error
            );

            Alert.alert(
                "Camera error",
                "Unable to take photo."
            );
        }
    }

    async function recordVideo() {
        if (!cameraRef.current) {
            return;
        }

        if (!microphonePermission?.granted) {
            const permission =
                await requestMicrophonePermission();

            if (!permission.granted) {
                Alert.alert(
                    "Microphone permission required",
                    "Microphone access is required to record video."
                );

                return;
            }
        }

        try {
            setRecording(true);

            const result =
                await cameraRef.current.recordAsync(
                    {
                        maxDuration:
                            MAX_VIDEO_DURATION,
                        maxFileSize:
                            MAX_VIDEO_SIZE,
                    }
                );

            if (!result) {
                return;
            }

            setMediaUri(result.uri);
            setMediaType("video");
            setMediaMimeType("video/mp4");
            setMediaSource("camera");
        } catch (error) {
            console.error(
                "VIDEO ERROR:",
                error
            );

            Alert.alert(
                "Video error",
                "Unable to record video."
            );
        } finally {
            setRecording(false);
        }
    }

    function stopRecording() {
        cameraRef.current?.stopRecording();
    }

    async function generateVideoThumbnail(
        videoUri: string
    ) {
        const { uri } =
            await VideoThumbnails.getThumbnailAsync(
                videoUri,
                {
                    time: 0,
                }
            );

        return uri;
    }

    /*
     * Kept for future gallery support.
     * There is intentionally no button for this yet.
     */
    async function handlePickFromGallery() {
        if (
            mediaProcessing ||
            recording ||
            loading
        ) {
            return;
        }

        setMediaProcessing(true);

        try {
            const result =
                await ImagePicker.launchImageLibraryAsync(
                    {
                        mediaTypes: [
                            "images",
                            "videos",
                        ],
                        allowsEditing: false,
                        quality: 1,
                    }
                );

            if (result.canceled) {
                return;
            }

            const asset = result.assets[0];

            if (
                asset.type !== "image" &&
                asset.type !== "video"
            ) {
                Alert.alert(
                    "Unsupported media",
                    "Please select an image or video."
                );

                return;
            }

            if (asset.type === "video") {
                if (
                    asset.duration == null ||
                    asset.fileSize == null
                ) {
                    Alert.alert(
                        "Unable to read video",
                        "We couldn't determine the video's size or duration."
                    );

                    return;
                }

                if (
                    asset.duration >
                    MAX_VIDEO_DURATION
                ) {
                    Alert.alert(
                        "Video too long",
                        "Videos must be 30 seconds or shorter."
                    );

                    return;
                }

                if (
                    asset.fileSize >
                    MAX_VIDEO_SIZE
                ) {
                    Alert.alert(
                        "Video too large",
                        "Videos must be 50 MB or smaller."
                    );

                    return;
                }
            }

            setMediaUri(asset.uri);
            setMediaType(asset.type);
            setMediaMimeType(
                asset.mimeType ?? null
            );
            setMediaSource("gallery");
        } finally {
            setMediaProcessing(false);
        }
    }

    async function saveMediaToGallery(
        uri: string
    ) {
        const permission =
            await MediaLibrary.requestPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "Please allow access to your photos so the media can be saved."
            );

            return;
        }

        await MediaLibrary.saveToLibraryAsync(
            uri
        );
    }

    function handleSubmit() {
        Alert.alert(
            "Submit Report?",
            "Are you sure you want to submit this report?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        processSubmit();
                    },
                },
            ]
        );
    }

    async function processSubmit() {
        if (!location) {
            Alert.alert(
                "Location required",
                "Please get your current location before submitting."
            );
            return;
        }

        if (!barangay) {
            Alert.alert(
                "Barangay required",
                "Please select a barangay."
            );
            return;
        }

        if (!category) {
            Alert.alert(
                "Category required",
                "Please select an incident category."
            );
            return;
        }

        if (!description.trim()) {
            Alert.alert(
                "Missing description",
                "Please describe the accident."
            );
            return;
        }

        try {
            setLoading(true);

            // Create the report first.
            // Media is optional.
            const report = await createReport({
                latitude: location.latitude,
                longitude: location.longitude,
                barangay,
                category,
                description: description.trim(),
            });

            let mediaUploadFailed = false;
            let gallerySaveFailed = false;

            // Media upload is optional.
            // If it fails, the report itself should still succeed.
            if (mediaUri && mediaType) {
                try {
                    if (!mediaMimeType) {
                        throw new Error("Unable to determine media type.");
                    }

                    const mediaPath = await uploadMedia(
                        mediaUri,
                        mediaType,
                        report.id,
                        "media",
                        mediaMimeType
                    );

                    let thumbnailPath: string | undefined;

                    if (mediaType === "video") {
                        const thumbnailUri =
                            await generateVideoThumbnail(mediaUri);

                        thumbnailPath = await uploadMedia(
                            thumbnailUri,
                            "image",
                            report.id,
                            "thumbnail",
                            "image/jpeg"
                        );
                    }

                    await updateReportMedia(
                        report.id,
                        mediaPath,
                        thumbnailPath
                    );
                } catch (error) {
                    console.error("MEDIA UPLOAD ERROR:", error);
                    mediaUploadFailed = true;
                }
            }

            // Saving to the user's gallery is also non-fatal.
            if (
                saveToGallery &&
                mediaSource === "camera" &&
                mediaUri
            ) {
                try {
                    await saveMediaToGallery(mediaUri);
                } catch (error) {
                    console.error("SAVE TO GALLERY ERROR:", error);
                    gallerySaveFailed = true;
                }
            }

            // Refresh report/notification data regardless of whether
            // optional media processing succeeded.
            await queryClient.invalidateQueries({
                queryKey: ["reports"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });

            let successMessage =
                "Your accident report has been submitted successfully.";

            if (!mediaUri) {
                successMessage +=
                    " No media was attached.";
            } else if (mediaUploadFailed) {
                successMessage +=
                    " However, the media could not be attached.";
            }

            if (gallerySaveFailed) {
                successMessage +=
                    " The media could not be saved to your gallery.";
            }

            Alert.alert(
                "Report submitted",
                successMessage,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/(tabs)/home");
                        },
                    },
                ]
            );

            setDescription("");
            setBarangay(null);
            setSuggestedBarangay(null);
            setSuggestedDistance(null);
            setLocation(null);
            setMediaUri(null);
            setMediaType(null);
            setSaveToGallery(false);
            setMediaMimeType(null);
            setMediaSource(null);
            setLocationError(false);
            setBarangayOverrideConfirmed(false);
        } finally {
            setLoading(false);
        }
    }

    function handleBarangaySelect(
        selectedBarangay: string | null
    ) {
        if (selectedBarangay === null) {
            setBarangayVisible(false);
            return;
        }

        setBarangayVisible(false);

        // Selecting the suggested barangay never
        // requires confirmation.
        if (
            selectedBarangay ===
            suggestedBarangay
        ) {
            setBarangay(selectedBarangay);
            return;
        }

        // The user already confirmed that they want
        // to override the suggested barangay.
        // Subsequent changes do not need another alert.
        if (barangayOverrideConfirmed) {
            setBarangay(selectedBarangay);
            return;
        }

        Alert.alert(
            "Change Barangay?",
            "This is not the nearest barangay to your current location. Are you sure you want to select this barangay?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        setBarangayOverrideConfirmed(
                            true
                        );

                        setBarangay(
                            selectedBarangay
                        );
                    },
                },
            ]
        );
    }

    if (!cameraPermission) {
        return <View />;
    }

    if (!cameraPermission.granted) {
        return (
            <View
                style={
                    styles.permissionContainer
                }
            >
                <Ionicons
                    name="camera-outline"
                    size={48}
                    color="#888888"
                />

                <Text
                    style={
                        styles.permissionTitle
                    }
                >
                    Camera access required
                </Text>

                <Text
                    style={
                        styles.permissionText
                    }
                >
                    Camera access is required to
                    create an accident report.
                </Text>

                <Pressable
                    style={
                        styles.permissionButton
                    }
                    onPress={
                        requestCameraPermission
                    }
                >
                    <Text
                        style={
                            styles.permissionButtonText
                        }
                    >
                        Allow Camera
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.container
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            enabled={
                                !recording &&
                                !loading &&
                                !mediaProcessing &&
                                !locationLoading
                            }
                        />
                    }
                >
                    <View
                        style={styles.header}
                    >
                        <Text
                            style={styles.heading}
                        >
                            Report an Accident
                        </Text>

                        <Text
                            style={styles.subtitle}
                        >
                            Capture what happened and
                            provide the location.
                        </Text>
                    </View>

                    {/* CAMERA */}
                    <View
                        style={styles.cameraFrame}
                    >
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="back"
                            mode={mode}
                            videoQuality="1080p"
                            videoBitrate={
                                8_000_000
                            }
                        />

                        {recording && (
                            <View
                                style={
                                    styles.recordingIndicator
                                }
                            >
                                <View
                                    style={
                                        styles.recordingDot
                                    }
                                />

                                <Text
                                    style={
                                        styles.recordingText
                                    }
                                >
                                    Recording
                                </Text>

                                <Text
                                    style={
                                        styles.recordingTimer
                                    }
                                >
                                    {formatRecordingDuration(
                                        recordingDuration
                                    )}{" "}
                                    / 00:30
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* MODE SWITCHER */}
                    <View
                        style={styles.modeSwitcher}
                    >
                        <Pressable
                            style={[
                                styles.modeButton,
                                mode === "picture" &&
                                    styles.modeButtonActive,
                            ]}
                            onPress={() => {
                                if (
                                    !recording &&
                                    !mediaProcessing
                                ) {
                                    setMode(
                                        "picture"
                                    );
                                }
                            }}
                            disabled={
                                recording ||
                                mediaProcessing
                            }
                        >
                            <Ionicons
                                name="camera-outline"
                                size={18}
                                color={
                                    mode ===
                                    "picture"
                                        ? "#333333"
                                        : "#777777"
                                }
                            />

                            <Text
                                style={[
                                    styles.modeButtonText,
                                    mode ===
                                        "picture" &&
                                        styles.modeButtonTextActive,
                                ]}
                            >
                                Photo
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.modeButton,
                                mode === "video" &&
                                    styles.modeButtonActive,
                            ]}
                            onPress={() => {
                                if (
                                    !recording &&
                                    !mediaProcessing
                                ) {
                                    setMode(
                                        "video"
                                    );
                                }
                            }}
                            disabled={
                                recording ||
                                mediaProcessing
                            }
                        >
                            <Ionicons
                                name="videocam-outline"
                                size={18}
                                color={
                                    mode ===
                                    "video"
                                        ? "#333333"
                                        : "#777777"
                                }
                            />

                            <Text
                                style={[
                                    styles.modeButtonText,
                                    mode === "video" &&
                                        styles.modeButtonTextActive,
                                ]}
                            >
                                Video
                            </Text>
                        </Pressable>
                    </View>

                    {/* CAPTURE BUTTON */}
                    <Pressable
                        style={[
                            styles.captureButton,
                            (
                                mediaProcessing ||
                                !!mediaUri
                            ) &&
                                styles.captureButtonDisabled,
                        ]}
                        onPress={
                            mode === "picture"
                                ? takePhoto
                                : recording
                                ? stopRecording
                                : recordVideo
                        }
                        disabled={
                            loading ||
                            mediaProcessing ||
                            !!mediaUri
                        }
                    >
                        <Ionicons
                            name={
                                mode === "picture"
                                    ? "camera"
                                    : recording
                                    ? "square"
                                    : "videocam"
                            }
                            size={28}
                            color="#FFFFFF"
                        />
                    </Pressable>

                    {/* GALLERY */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.galleryButton,
                            pressed &&
                                styles.galleryButtonPressed,
                        ]}
                        onPress={
                            handlePickFromGallery
                        }
                        disabled={
                            loading ||
                            recording ||
                            mediaProcessing
                        }
                    >
                        {mediaProcessing ? (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color="#555555"
                                />

                                <Text
                                    style={
                                        styles.galleryButtonText
                                    }
                                >
                                    Checking media...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons
                                    name="images-outline"
                                    size={20}
                                    color="#555555"
                                />

                                <Text
                                    style={
                                        styles.galleryButtonText
                                    }
                                >
                                    Choose from Gallery
                                </Text>
                            </>
                        )}
                    </Pressable>

                    {/* CAPTURED MEDIA */}
                    {mediaUri && (
                        <View
                            style={
                                styles.capturedSection
                            }
                        >
                            <View
                                style={
                                    styles.sectionHeader
                                }
                            >
                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Captured media
                                </Text>

                                <Pressable
                                    onPress={() => {
                                        setMediaUri(
                                            null
                                        );

                                        setMediaType(
                                            null
                                        );
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.retakeText
                                        }
                                    >
                                        Retake
                                    </Text>
                                </Pressable>
                            </View>

                            {mediaType ===
                            "image" ? (
                                <Image
                                    source={{
                                        uri: mediaUri,
                                    }}
                                    style={
                                        styles.preview
                                    }
                                />
                            ) : (
                                <View
                                    style={
                                        styles.videoPreview
                                    }
                                >
                                    <Ionicons
                                        name="videocam"
                                        size={32}
                                        color="#FFFFFF"
                                    />

                                    <Text
                                        style={
                                            styles.videoPreviewText
                                        }
                                    >
                                        Video recorded
                                    </Text>
                                </View>
                            )}

                            {/* SAVE TO GALLERY */}
                            <View
                                style={[
                                    styles.saveGalleryRow,
                                    mediaSource ===
                                        "gallery" &&
                                        styles.saveGalleryRowDisabled,
                                ]}
                            >
                                <View
                                    style={
                                        styles.saveGalleryContent
                                    }
                                >
                                    <Ionicons
                                        name="download-outline"
                                        size={20}
                                        color={
                                            mediaSource ===
                                            "gallery"
                                                ? "#AAAAAA"
                                                : "#555555"
                                        }
                                    />

                                    <View
                                        style={
                                            styles.saveGalleryTextContainer
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.saveGalleryTitle,
                                                mediaSource ===
                                                    "gallery" &&
                                                    styles.saveGalleryTitleDisabled,
                                            ]}
                                        >
                                            Save to device
                                        </Text>

                                        <Text
                                            style={[
                                                styles.saveGallerySubtitle,
                                                mediaSource ===
                                                    "gallery" &&
                                                    styles.saveGallerySubtitleDisabled,
                                            ]}
                                        >
                                            {mediaSource ===
                                            "gallery"
                                                ? "Already saved in your gallery"
                                                : "Keep a copy in your gallery"}
                                        </Text>
                                    </View>
                                </View>

                                <Switch
                                    value={
                                        saveToGallery
                                    }
                                    onValueChange={
                                        setSaveToGallery
                                    }
                                    disabled={
                                        mediaSource ===
                                        "gallery"
                                    }
                                />
                            </View>
                        </View>
                    )}

                    {/* LOCATION */}
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Location
                        </Text>

                        <Pressable
                            style={styles.locationButton}
                            onPress={handleGetLocation}
                            disabled={loading || locationLoading}
                        >
                            {/* LEFT ICON */}
                            {locationLoading ? (
                                <Ionicons
                                    name="ellipsis-horizontal"
                                    size={22}
                                    color="#777777"
                                />
                            ) : locationError ? (
                                <Ionicons
                                    name="close-circle"
                                    size={22}
                                    color="#C62828"
                                />
                            ) : (
                                <Ionicons
                                    name={
                                        location
                                            ? "checkmark-circle"
                                            : "location-outline"
                                    }
                                    size={22}
                                    color={
                                        location
                                            ? "#2E7D32"
                                            : "#777777"
                                    }
                                />
                            )}

                            <View
                                style={
                                    styles.locationContent
                                }
                            >
                                <Text
                                    style={
                                        styles.locationTitle
                                    }
                                >
                                    {locationLoading
                                        ? "Detecting location"
                                        : locationError
                                        ? "Location unavailable"
                                        : location
                                        ? "Location detected"
                                        : "Get my current location"}
                                </Text>

                                <Text
                                    style={
                                        styles.locationSubtitle
                                    }
                                >
                                    {locationLoading
                                        ? "Determining your current location"
                                        : locationError
                                        ? "Tap the arrow to try again"
                                        : location
                                        ? `${location.latitude.toFixed(
                                              5
                                          )}, ${location.longitude.toFixed(
                                              5
                                          )}`
                                        : "Used to suggest your barangay"}
                                </Text>
                            </View>

                            {/* RIGHT ICON */}
                            {locationLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#777777"
                                />
                            ) : (
                                <Ionicons
                                    name="refresh"
                                    size={20}
                                    color="#888888"
                                />
                            )}
                        </Pressable>
                    </View>

                    {/* BARANGAY */}
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Barangay
                        </Text>

                        <Pressable
                            style={[
                                styles.barangaySelector,
                                (!location ||
                                    locationLoading) &&
                                    styles.barangaySelectorDisabled,
                            ]}
                            onPress={() =>
                                setBarangayVisible(
                                    true
                                )
                            }
                            disabled={
                                loading ||
                                !location ||
                                locationLoading
                            }
                        >
                            <View
                                style={
                                    styles.barangayContent
                                }
                            >
                                <Ionicons
                                    name="location-outline"
                                    size={20}
                                    color={
                                        !location ||
                                        locationLoading
                                            ? "#AAAAAA"
                                            : "#555555"
                                    }
                                />

                                <View>
                                    <Text
                                        style={[
                                            styles.barangayText,
                                            (!location ||
                                                locationLoading) &&
                                                styles.barangayTextDisabled,
                                        ]}
                                    >
                                        {barangay ??
                                            "Select barangay"}
                                    </Text>

                                    {suggestedBarangay &&
                                        barangay ===
                                            suggestedBarangay && (
                                            <Text
                                                style={
                                                    styles.suggestionText
                                                }
                                            >
                                                Suggested from
                                                your location
                                                {suggestedDistance !==
                                                null
                                                    ? ` • ${suggestedDistance.toFixed(
                                                          2
                                                      )} km`
                                                    : ""}
                                            </Text>
                                        )}
                                </View>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={
                                    !location ||
                                    locationLoading
                                        ? "#AAAAAA"
                                        : "#888888"
                                }
                            />
                        </Pressable>
                    </View>

                    {/* INCIDENT CATEGORY */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Incident Category
                        </Text>

                        <Pressable
                            style={styles.categorySelector}
                            onPress={() => setCategoryVisible(true)}
                            disabled={loading}
                        >
                            <View style={styles.categoryContent}>
                                <Ionicons
                                    name="grid-outline"
                                    size={21}
                                    color={category ? "#C62828" : "#777777"}
                                />

                                <View style={styles.categoryTextContainer}>
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            !category && styles.categoryPlaceholder,
                                        ]}
                                    >
                                        {category
                                            ? INCIDENT_CATEGORIES.find(
                                                (item) => item.value === category
                                            )?.label
                                            : "Select incident category"}
                                    </Text>

                                    <Text style={styles.categorySubtitle}>
                                        Choose the category that best describes the incident
                                    </Text>
                                </View>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#888888"
                            />
                        </Pressable>
                    </View>

                    {/* DESCRIPTION */}
                    <View
                        style={styles.section}
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Description
                        </Text>

                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what happened..."
                            multiline
                            maxLength={200}
                            textAlignVertical="top"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            editable={!loading}
                            style={[styles.descriptionInput, loading && { opacity: 0.7 },]}
                        />

                        <Text style={styles.characterCount}>
                            {description.length}/200
                        </Text>
                    </View>

                    {/* SUBMIT */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.submitButton,
                            pressed &&
                                styles.submitButtonPressed,
                            (
                                loading ||
                                mediaProcessing
                            ) &&
                                styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={
                            loading ||
                            mediaProcessing
                        }
                    >
                        <Ionicons
                            name="paper-plane-outline"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.submitButtonText
                            }
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Report"}
                        </Text>
                    </Pressable>

                    <BarangaySelectModal
                        visible={
                            barangayVisible
                        }
                        value={barangay}
                        onSelect={
                            handleBarangaySelect
                        }
                        onClose={() =>
                            setBarangayVisible(
                                false
                            )
                        }
                    />
                    <CategorySelectModal
                        visible={categoryVisible}
                        value={category}
                        onSelect={setCategory}
                        onClose={() => setCategoryVisible(false)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    keyboardView: {
        flex: 1,
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    header: {
        marginBottom: 18,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222222",
    },

    subtitle: {
        fontSize: 14,
        color: "#888888",
        marginTop: 5,
    },

    cameraFrame: {
        width: "100%",
        height: 270,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#111111",
    },

    camera: {
        flex: 1,
    },

    recordingIndicator: {
        position: "absolute",
        top: 14,
        left: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor:
            "rgba(0,0,0,0.55)",
    },

    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#E53935",
    },

    recordingText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },

    recordingTimer: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 2,
    },

    modeSwitcher: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 14,
        padding: 4,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },

    modeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingHorizontal: 22,
        paddingVertical: 9,
        borderRadius: 9,
    },

    modeButtonActive: {
        backgroundColor: "#F0F0F0",
    },

    modeButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555555",
    },

    modeButtonTextActive: {
        color: "#333333",
    },

    captureButton: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#C62828",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        elevation: 3,
    },

    captureButtonRecording: {
        backgroundColor: "#8E0000",
    },

    captureButtonDisabled: {
        opacity: 0.5,
    },

    capturedSection: {
        marginTop: 24,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    section: {
        marginTop: 24,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 10,
    },

    retakeText: {
        color: "#C62828",
        fontSize: 14,
        fontWeight: "600",
    },

    preview: {
        width: "100%",
        height: 180,
        borderRadius: 14,
    },

    videoPreview: {
        height: 180,
        borderRadius: 14,
        backgroundColor: "#222222",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    videoPreviewText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },

    locationButton: {
        minHeight: 68,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    locationContent: {
        flex: 1,
    },

    locationTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
    },

    locationSubtitle: {
        fontSize: 12,
        color: "#888888",
        marginTop: 3,
    },

    barangaySelector: {
        minHeight: 64,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    barangaySelectorDisabled: {
        backgroundColor: "#F5F5F5",
        borderColor: "#E5E5E5",
        opacity: 0.7,
    },

    barangayContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    barangayText: {
        fontSize: 15,
        color: "#333333",
        fontWeight: "500",
    },

    barangayTextDisabled: {
        color: "#AAAAAA",
    },

    suggestionText: {
        fontSize: 12,
        color: "#888888",
        marginTop: 3,
    },

    descriptionInput: {
        minHeight: 120,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        padding: 14,
        fontSize: 15,
        color: "#333333",
    },

    submitButton: {
        minHeight: 54,
        borderRadius: 14,
        backgroundColor: "#C62828",
        marginTop: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    submitButtonPressed: {
        opacity: 0.85,
    },

    submitButtonDisabled: {
        opacity: 0.6,
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    permissionContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    permissionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333333",
        marginTop: 14,
    },

    permissionText: {
        fontSize: 14,
        color: "#888888",
        textAlign: "center",
        marginTop: 6,
        marginBottom: 20,
    },

    permissionButton: {
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: "#C62828",
    },

    permissionButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    galleryButton: {
        minHeight: 48,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    galleryButtonPressed: {
        backgroundColor: "#F5F5F5",
    },

    galleryButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555555",
    },

    saveGalleryRow: {
        minHeight: 64,
        marginTop: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    saveGalleryRowDisabled: {
        backgroundColor: "#F5F5F5",
        borderColor: "#E5E5E5",
    },

    saveGalleryContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },

    saveGalleryTextContainer: {
        flex: 1,
    },

    saveGalleryTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
    },

    saveGalleryTitleDisabled: {
        color: "#AAAAAA",
    },

    saveGallerySubtitle: {
        fontSize: 12,
        color: "#888888",
        marginTop: 3,
    },

    saveGallerySubtitleDisabled: {
        color: "#AAAAAA",
    },
    characterCount: {
        fontSize: 12,
        color: "#888888",
        textAlign: "right",
        marginTop: 6,
    },
    categorySelector: {
        minHeight: 70,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    categoryContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    categoryTextContainer: {
        flex: 1,
    },

    categoryText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
    },

    categoryPlaceholder: {
        color: "#888888",
        fontWeight: "500",
    },

    categorySubtitle: {
        fontSize: 12,
        color: "#888888",
        marginTop: 4,
        lineHeight: 17,
    },
});