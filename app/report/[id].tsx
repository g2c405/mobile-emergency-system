import StatusBadge from "@/components/ui/reports/statusBadge";
import {
    getReport,
    getReportVideoUrl,
} from "@/services/reportService";
import { Report } from "@/types/report";
import formatDescription from "@/utils/formatDescription";
import { Ionicons } from "@expo/vector-icons";
import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    router,
    useLocalSearchParams,
} from "expo-router";
import {
    VideoView,
    useVideoPlayer,
} from "expo-video";
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

const CATEGORY_LABELS: Record<string, string> = {
    road_accident: "Road Accident",
    fire: "Fire",
    natural_hazard: "Flooding and Natural Hazards",
    medical_emergency: "Medical Emergency",
    infrastructure_hazard: "Infrastructure Hazard",
    public_safety: "Public Safety Incident",
    other: "Other",
};

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
    const { id, source } = useLocalSearchParams<{
        id: string;
        source?: string;
    }>();

    const reportId = Number(id);
    const queryClient = useQueryClient();

    const {
        data: report,
        isLoading: reportLoading,
        isError: reportError,
    } = useQuery({
        queryKey: ["report", reportId],
        queryFn: async () => {
            if (source === "notifications") {
                return getReport(reportId);
            }

            const reports = queryClient.getQueryData<Report[]>(["reports"]);
            const cachedReport = reports?.find(
                (item) => item.id === reportId
            );

            if (cachedReport) return cachedReport;

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
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    if (reportError || !report) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Report not found.</Text>
            </View>
        );
    }

    const categoryLabel = report.category
        ? CATEGORY_LABELS[report.category] ??
          report.category
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Uncategorized";

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

                {/* Report information */}
                <View style={styles.infoSection}>
                    {/* Submitted */}
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
                                {new Date(report.created_at).toLocaleString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* Barangay */}
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

                    {/* Category */}
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="grid-outline"
                            size={20}
                            color="#666666"
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Category
                            </Text>
                            <Text style={styles.infoValue}>
                                {categoryLabel}
                            </Text>
                        </View>
                    </View>

                    

                    {/* Ongoing */}
                    {report.ongoing_at && (
                        <View style={styles.infoRow}>
                            <Ionicons
                                name="time-outline"
                                size={20}
                                color="#666666"
                            />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>
                                    Ongoing
                                </Text>
                                <Text style={styles.infoValue}>
                                    {new Date(
                                        report.ongoing_at
                                    ).toLocaleString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Resolved */}
                    {report.status === "resolved" &&
                        report.resolved_at && (
                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={20}
                                    color="#666666"
                                />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>
                                        Resolved
                                    </Text>
                                    <Text style={styles.infoValue}>
                                        {new Date(
                                            report.resolved_at
                                        ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </Text>
                                </View>
                            </View>
                        )}
                    {/* Status */}
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
                
                
                {/* Description */}
                <View style={styles.descriptionCard}>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color="#666666"
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Description
                            </Text>
                            <Text style={styles.descriptionValue}>
                                {formatDescription(
                                    report.description?.trim()
                                ) || "No description provided."}
                            </Text>
                        </View>
                    </View>
                </View>


                {/* Media */}
                <View style={styles.mediaSection}>
                    <Text style={styles.sectionTitle}>
                        Evidence
                    </Text>

                    {report.image_url ? (
                        <Image
                            source={{ uri: report.image_url }}
                            style={styles.image}
                        />
                    ) : null}

                    {report.video_thumbnail_url ? (
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
                    ) : null}

                    {!report.image_url?.trim() &&
                        !report.video_thumbnail_url?.trim() && (
                            <View style={styles.noMediaContainer}>
                                <Ionicons
                                    name="image-outline"
                                    size={32}
                                    color="#999999"
                                />
                                <Text style={styles.stateText}>
                                    No media uploaded
                                </Text>
                            </View>
                        )}
                </View>

                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    infoSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        padding: 16,
        gap: 18,
        marginBottom: 0,
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
    badge: {
        alignSelf: "flex-start",
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
    descriptionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        padding: 16,
        marginTop: 12,
        marginBottom: 24,
    },
    descriptionValue: {
        fontSize: 15,
        color: "#333333",
        fontWeight: "400",
        lineHeight: 22,
    },
    noMediaContainer: {
        width: "100%",
        height: 240,
        borderRadius: 14,
        backgroundColor: "#EAEAEA",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
});
