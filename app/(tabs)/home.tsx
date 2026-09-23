import ReportCard from "@/components/ui/reports/reportCard";
import ReportFilters from "@/components/ui/reports/reportFilters";
import { getReports } from "@/services/reportService";
import { ReportStatus } from "@/types/report";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const {
        data: reports = [],
        isLoading,
        isRefetching,
        refetch,
    } = useQuery({queryKey: ['reports'], queryFn: getReports});

    const [sortOrder, setSortOrder] = useState<
        "newest" | "oldest"
    >("newest");

    const [selectedStatuses, setSelectedStatuses] =
        useState<ReportStatus[]>([]);

    const [mediaType, setMediaType] = useState<
        "all" | "image" | "video"
    >("all");

    const [selectedBarangay, setSelectedBarangay] =
        useState<string | null>(null);

    const filteredReports = useMemo(()=>{
        let result = [...reports];
        if(selectedStatuses.length>0){
            result = result.filter((report)=> selectedStatuses.includes(report.status));
        }
        if(mediaType === "image"){
            result = result.filter((report)=> !!report.image_url);
        }
        if(mediaType === "video"){
            result = result.filter((report)=> !!report.video_thumbnail_url);
        }
        if(selectedBarangay){
            result = result.filter((report)=> report.barangay === selectedBarangay);
        }
        result.sort((a, b) => {
            const dateA = new Date(
                a.created_at
            ).getTime();

            const dateB = new Date(
                b.created_at
            ).getTime();

            return sortOrder === "newest"
                ? dateB - dateA
                : dateA - dateB;
        });

        return result;
    },[
        reports,
        selectedStatuses,
        mediaType,
        selectedBarangay,
        sortOrder,
    ]);
    if (isLoading) {
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

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.heading}>
                        Reports
                    </Text>

                    <Text style={styles.subtitle}>
                        View your submitted reports.
                    </Text>
                </View>
                
                <Pressable
                    style={({ pressed }) => [
                        styles.filterButton,
                        pressed && styles.filterButtonPressed,
                    ]}
                    onPress={() => setFiltersVisible(true)}
                >
                    <Ionicons
                        name="options-outline"
                        size={18}
                        color="#333333"
                    />

                    <Text style={styles.filterButtonText}>
                        Filters
                    </Text>
                </Pressable>
                <ReportFilters
                    visible={filtersVisible}
                    onClose={() => setFiltersVisible(false)}
                    sortOrder={sortOrder}
                    selectedStatuses={selectedStatuses}
                    mediaType={mediaType}
                    selectedBarangay={selectedBarangay}
                    onSortChange={setSortOrder}
                    onStatusChange={setSelectedStatuses}
                    onMediaTypeChange={setMediaType}
                    onBarangayChange={setSelectedBarangay}
                />
            </View>
            <FlatList
                data={filteredReports}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={({ item }) => (
                    <ReportCard
                        id={item.id}
                        description={item.description}
                        barangay={item.barangay}
                        status={item.status}
                        created_at={item.created_at}
                        image_url={item.image_url}
                        video_thumbnail_url={
                            item.video_thumbnail_url
                        }
                    />
                )}
                ListEmptyComponent={
                    reports.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="document-text-outline"
                                size={48}
                                color="#AAAAAA"
                            />

                            <Text style={styles.emptyTitle}>
                                No reports yet
                            </Text>

                            <Text style={styles.emptyText}>
                                You haven't submitted any reports yet.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="filter-outline"
                                size={48}
                                color="#AAAAAA"
                            />

                            <Text style={styles.emptyTitle}>
                                No results
                            </Text>

                            <Text style={styles.emptyText}>
                                No reports match your current filters.
                            </Text>
                        </View>
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    filterRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 14,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    subtitle: {
        fontSize: 14,
        color: "#888888",
        marginTop: 5,
    },
    headerText: {
        flex: 1,
        marginRight: 12,
    },


    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333333",
        marginTop: 14,
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 14,
        color: "#888888",
        textAlign: "center",
        lineHeight: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222222",
    },

    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,

        paddingHorizontal: 12,
        paddingVertical: 8,

        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,

        backgroundColor: "#FFFFFF",
    },

    filterButtonPressed: {
        opacity: 0.7,
    },

    filterButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },
});