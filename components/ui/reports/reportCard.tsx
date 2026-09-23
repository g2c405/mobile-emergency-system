import { ReportStatus } from "@/types/report";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import StatusBadge from "./statusBadge";

interface ReportCardProps {
    id: number;
    description: string;
    barangay: string;
    status: ReportStatus;
    created_at: string;
    image_url?: string | null;
    video_thumbnail_url?: string | null;
}

export default function ReportCard({
    id,
    description,
    barangay,
    status,
    created_at,
    image_url,
    video_thumbnail_url,
}: ReportCardProps) {
    function handlePress() {
        router.push(`/report/${id}`);
    }

    const formattedDate = new Date(
        created_at
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const formattedTime = new Date(
        created_at
    ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            {image_url ? (
                <Image
                    style={styles.media}
                    source={{ uri: image_url }}
                    contentFit="cover"
                />
            ) : video_thumbnail_url ? (
                <View style={styles.mediaContainer}>
                    <Image
                        style={styles.media}
                        source={{
                            uri: video_thumbnail_url,
                        }}
                        contentFit="cover"
                    />

                    <View style={styles.videoOverlay}>
                        <View style={styles.playButton}>
                            <Ionicons
                                name="play"
                                size={16}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>
                </View>
            ) : null}

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text
                        style={styles.description}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {description}
                    </Text>

                    <StatusBadge status={status} />

                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="#999999"
                    />
                </View>

                <View style={styles.locationRow}>
                    <Ionicons
                        name="location-outline"
                        size={17}
                        color="#C62828"
                    />

                    <Text
                        style={styles.location}
                        numberOfLines={1}
                    >
                        {barangay}
                    </Text>
                </View>

                <View style={styles.dateRow}>
                    <Ionicons
                        name="time-outline"
                        size={15}
                        color="#888888"
                    />

                    <Text style={styles.date}>
                        {formattedDate}, {formattedTime}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E5E5",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,

        elevation: 2,

        flexDirection: "row",
        padding: 12,
    },

    cardPressed: {
        opacity: 0.7,
    },

    mediaContainer: {
        position: "relative",
    },

    media: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },

    videoOverlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: "space-between",
        minWidth: 0,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 6,
    },

    description: {
        flex: 1,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "600",
        color: "#222222",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
    },

    location: {
        flex: 1,
        fontSize: 14,
        color: "#666666",
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
    },

    date: {
        flex: 1,
        fontSize: 12,
        color: "#888888",
    },
});
