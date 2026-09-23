import StatusBadge from "@/components/ui/reports/statusBadge";
import { getReport, getReportVideoUrl } from "@/services/reportService";
import { Report } from "@/types/report";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView, StyleSheet, Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ReportVideo({ uri }: { uri: string }) {
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

export default function ReportDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const reportId = Number(id);

    const queryClient = useQueryClient();

    

    const {
        data: report,
        isLoading: reportLoading,
        isError: reportError,
    } = useQuery({
        queryKey: ["report", reportId],
        queryFn: async () => {
            const reports = queryClient.getQueryData<Report[]>([
                "reports",
            ]);
            const cachedReport = reports?.find(
                (item) => item.id === reportId
            );

            if (cachedReport) {
                return cachedReport;
            }

            return getReport(reportId);
        },
        enabled: !Number.isNaN(reportId),
        });

    const {
        data: videoData,
        isLoading: videoLoading,
        isError: videoError,
    } = useQuery({
        queryKey: ["report-video", reportId],
        queryFn: () => getReportVideoUrl(reportId),
        enabled: !!report?.video_thumbnail_url,
        });

    if (reportLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (reportError || !report) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>
                    Report not found.
                </Text>
            </View>
        );
    }

    return (
       <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
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
                           Report Details
                        </Text>
                    </Pressable>

                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {report.description}
                </Text>

                {/* Report information */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="location-outline"
                            size={20}
                            color="#666666"
                        />

                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Barangay
                            </Text>

                            <Text style={styles.infoValue}>
                                {report.barangay}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#666666"
                        />

                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Submitted
                            </Text>

                            <Text style={styles.infoValue}>
                                {new Date(
                                    report.created_at
                                ).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color="#666666"
                        />

                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Status
                            </Text>

                            <StatusBadge
                                style={styles.badge}
                                status={report.status}
                            />
                        </View>
                    </View>
                </View>

                {/* Media */}
                {(report.image_url ||
                    report.video_thumbnail_url) && (
                    <View style={styles.mediaSection}>
                        <Text style={styles.sectionTitle}>
                            Evidence
                        </Text>

                        {report.image_url && (
                            <Image
                                source={{
                                    uri: report.image_url,
                                }}
                                style={styles.image}
                            />
                        )}

                        {report.video_thumbnail_url && (
                            <View style={styles.videoContainer}>
                                <Image
                                    source={{
                                        uri: report.video_thumbnail_url,
                                    }}
                                    style={styles.videoThumbnail}
                                />

                                {videoLoading && (
                                    <View style={styles.mediaState}>
                                        <ActivityIndicator
                                            size="small"
                                            color="#C62828"
                                        />

                                        <Text style={styles.stateText}>
                                            Loading video...
                                        </Text>
                                    </View>
                                )}

                                {videoError && (
                                    <View style={styles.mediaState}>
                                        <Ionicons
                                            name="alert-circle-outline"
                                            size={32}
                                            color="#999999"
                                        />

                                        <Text style={styles.stateText}>
                                            Failed to load video.
                                        </Text>
                                    </View>
                                )}

                                {videoData?.video_url && (
                                    <ReportVideo
                                        uri={videoData.video_url}
                                    />
                                )}
                            </View>
                        )}
                    </View>
                )}
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

    header: {
        marginBottom: 24,
    },

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },

    backText: {
        fontSize: 15,
        color: "#444444",
        marginLeft: 2,
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#777777",
    },

    description: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 24,
    },
    badge: {
        alignSelf: "flex-start",
    },

    infoSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        padding: 16,
        gap: 18,
        marginBottom: 28,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    infoContent: {
        flex: 1,
        gap: 2,
    },

    infoLabel: {
        fontSize: 12,
        color: "#999999",
        fontWeight: "500",
    },

    infoValue: {
        fontSize: 15,
        color: "#333333",
        fontWeight: "600",
    },

    mediaSection: {
        gap: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222222",
    },

    image: {
        width: "100%",
        height: 240,
        borderRadius: 14,
        backgroundColor: "#EAEAEA",
    },

    mediaState: {
        minHeight: 240,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    video: {
        width: "100%",
        height: "100%",
    },

    stateText: {
        fontSize: 14,
        color: "#888888",
    },

    videoContainer: {
        width: "100%",
        height: 250,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#EAEAEA",
    },
    videoThumbnail: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
});