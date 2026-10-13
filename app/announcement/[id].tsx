
import {
    getAnnouncement,
    getAnnouncementVideoUrl,
} from "@/services/notificationService";
import { Announcement } from "@/types/announcement";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AnnouncementVideo({ uri }: { uri: string }) {
    const player = useVideoPlayer(uri, (player) => {
        player.loop = false;
    });

    return (
        <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls
        />
    );
}

export default function AnnouncementDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const announcementId = Number(id);

    const {
        data: announcement,
        isLoading,
        isError,
    } = useQuery<Announcement>({
        queryKey: ["announcement", announcementId],
        queryFn: () => getAnnouncement(announcementId),
        enabled:
            Number.isInteger(announcementId) &&
            announcementId > 0,
    });

    const {
        data: videoData,
        isLoading: videoLoading,
        isError: videoError,
    } = useQuery({
        queryKey: ["announcement-video", announcementId],
        queryFn: () =>
            getAnnouncementVideoUrl(announcementId),
        enabled:
            !!announcement?.media &&
            !announcement.image_url,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        );
    }

    if (isError || !announcement) {
        return (
            <View style={styles.centered}>
                <Text>Announcement not found.</Text>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        Go back
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#222222"
                    />
                    <Text style={styles.backText}>
                        Announcement Details
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    {announcement.title}
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="location-outline"
                        size={18}
                        color="#666666"
                    />
                    <Text style={styles.infoText}>
                        {announcement.barangay}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#666666"
                    />
                    <Text style={styles.infoText}>
                        {new Date(
                            announcement.created_at
                        ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

                <Text style={styles.content}>
                    {announcement.content}
                </Text>

                {announcement.image_url ? (
                    <View style={styles.mediaSection}>
                        <Text style={styles.sectionTitle}>
                            Attachment
                        </Text>
                        <Image
                            source={{
                                uri: announcement.image_url,
                            }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                ) : announcement.media ? (
                    <View style={styles.mediaSection}>
                        <Text style={styles.sectionTitle}>
                            Attachment
                        </Text>

                        {announcement.video_thumbnail_url && (
                            <Image
                                source={{
                                    uri: announcement.video_thumbnail_url,
                                }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}

                        {videoLoading && (
                            <View style={styles.mediaState}>
                                <ActivityIndicator />
                                <Text style={styles.stateText}>
                                    Loading video...
                                </Text>
                            </View>
                        )}

                        {videoError && (
                            <Text style={styles.stateText}>
                                Failed to load video.
                            </Text>
                        )}

                        {videoData?.video_url && (
                            <AnnouncementVideo
                                uri={videoData.video_url}
                            />
                        )}

                        {!videoLoading &&
                            !videoError &&
                            !videoData?.video_url && (
                                <Text style={styles.stateText}>
                                    No playable video is available.
                                </Text>
                            )}
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 24,
    },
    backText: {
        fontSize: 15,
        color: "#444444",
        marginLeft: 2,
    },
    title: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: "#666666",
    },
    content: {
        fontSize: 16,
        lineHeight: 25,
        color: "#333333",
        marginTop: 16,
        marginBottom: 28,
    },
    mediaSection: {
        gap: 12,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222222",
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 14,
        backgroundColor: "#EAEAEA",
    },
    video: {
        width: "100%",
        height: 250,
        backgroundColor: "#EAEAEA",
        borderRadius: 14,
    },
    mediaState: {
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    stateText: {
        fontSize: 14,
        color: "#888888",
        marginVertical: 8,
    },
});
