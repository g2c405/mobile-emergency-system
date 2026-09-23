import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import BarangaySelectModal from "../generic/barangaySelect";
import { FilterOption } from "./filterOptions";

import { ReportStatus } from "@/types/report";

interface ReportFiltersProps {
    visible: boolean;
    onClose: () => void;

    sortOrder: "newest" | "oldest";
    selectedStatuses: ReportStatus[];
    mediaType: "all" | "image" | "video";
    selectedBarangay: string | null;

    onSortChange: (
        value: "newest" | "oldest"
    ) => void;

    onStatusChange: (
        value: ReportStatus[]
    ) => void;

    onMediaTypeChange: (
        value: "all" | "image" | "video"
    ) => void;

    onBarangayChange: (
        value: string | null
    ) => void;
}

export default function ReportFilters({
    visible,
    onClose,

    sortOrder,
    selectedStatuses,
    mediaType,
    selectedBarangay,

    onSortChange,
    onStatusChange,
    onMediaTypeChange,
    onBarangayChange,
}: ReportFiltersProps) {
    const [tempSortOrder, setTempSortOrder] =
        useState(sortOrder);

    const [tempStatuses, setTempStatuses] =
        useState<ReportStatus[]>(selectedStatuses);

    const [tempMediaType, setTempMediaType] =
        useState(mediaType);

    const [tempBarangay, setTempBarangay] =
        useState<string | null>(selectedBarangay);

    const [barangayVisible, setBarangayVisible] =
        useState(false);

    useEffect(() => {
        if (visible) {
            setTempSortOrder(sortOrder);
            setTempStatuses(selectedStatuses);
            setTempMediaType(mediaType);
            setTempBarangay(selectedBarangay);
        }
    }, [
        visible,
        sortOrder,
        selectedStatuses,
        mediaType,
        selectedBarangay,
    ]);

    function toggleStatus(status: ReportStatus) {
        setTempStatuses((current) => {
            if (current.includes(status)) {
                return current.filter(
                    (item) => item !== status
                );
            }

            return [...current, status];
        });
    }

    function handleApply() {
        onSortChange(tempSortOrder);
        onStatusChange(tempStatuses);
        onMediaTypeChange(tempMediaType);
        onBarangayChange(tempBarangay);

        onClose();
    }

    function handleClear() {
        setTempSortOrder("newest");
        setTempStatuses([]);
        setTempMediaType("all");
        setTempBarangay(null);
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />

                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Filters
                        </Text>

                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#555555"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.scrollContent
                        }
                    >
                        {/* SORT */}
                        <View style={styles.section}>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Sort by
                            </Text>

                            <View style={styles.optionRow}>
                                <FilterOption
                                    label="Newest first"
                                    selected={
                                        tempSortOrder ===
                                        "newest"
                                    }
                                    onPress={() =>
                                        setTempSortOrder(
                                            "newest"
                                        )
                                    }
                                />

                                <FilterOption
                                    label="Oldest first"
                                    selected={
                                        tempSortOrder ===
                                        "oldest"
                                    }
                                    onPress={() =>
                                        setTempSortOrder(
                                            "oldest"
                                        )
                                    }
                                />
                            </View>
                        </View>

                        {/* STATUS */}
                        <View style={styles.section}>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Status
                            </Text>

                            <View style={styles.optionList}>
                                <FilterOption
                                    label="Pending"
                                    selected={tempStatuses.includes(
                                        "pending"
                                    )}
                                    multiSelect
                                    onPress={() =>
                                        toggleStatus(
                                            "pending"
                                        )
                                    }
                                />

                                <FilterOption
                                    label="Ongoing"
                                    selected={tempStatuses.includes(
                                        "ongoing"
                                    )}
                                    multiSelect
                                    onPress={() =>
                                        toggleStatus(
                                            "ongoing"
                                        )
                                    }
                                />

                                <FilterOption
                                    label="Resolved"
                                    selected={tempStatuses.includes(
                                        "resolved"
                                    )}
                                    multiSelect
                                    onPress={() =>
                                        toggleStatus(
                                            "resolved"
                                        )
                                    }
                                />
                            </View>
                        </View>

                        {/* MEDIA */}
                        <View style={styles.section}>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Media
                            </Text>

                            <View style={styles.optionList}>
                                <FilterOption
                                    label="All media"
                                    selected={
                                        tempMediaType ===
                                        "all"
                                    }
                                    onPress={() =>
                                        setTempMediaType(
                                            "all"
                                        )
                                    }
                                />

                                <FilterOption
                                    label="Images"
                                    selected={
                                        tempMediaType ===
                                        "image"
                                    }
                                    onPress={() =>
                                        setTempMediaType(
                                            "image"
                                        )
                                    }
                                />

                                <FilterOption
                                    label="Videos"
                                    selected={
                                        tempMediaType ===
                                        "video"
                                    }
                                    onPress={() =>
                                        setTempMediaType(
                                            "video"
                                        )
                                    }
                                />
                            </View>
                        </View>

                        {/* BARANGAY */}
                        <View style={styles.section}>
                            <Text
                                style={styles.sectionTitle}
                            >
                                Barangay
                            </Text>

                            <Pressable
                                style={
                                    styles.barangaySelector
                                }
                                onPress={() =>
                                    setBarangayVisible(
                                        true
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.barangayText,
                                        !tempBarangay &&
                                            styles.placeholder,
                                    ]}
                                >
                                    {tempBarangay ??
                                        "All barangays"}
                                </Text>

                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#888888"
                                />
                            </Pressable>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Pressable
                            style={styles.clearButton}
                            onPress={handleClear}
                        >
                            <Text
                                style={
                                    styles.clearButtonText
                                }
                            >
                                Clear
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.applyButton}
                            onPress={handleApply}
                        >
                            <Text
                                style={
                                    styles.applyButtonText
                                }
                            >
                                Apply Filters
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* BARANGAY MODAL */}
               

                <BarangaySelectModal
                    visible={barangayVisible}
                    value={tempBarangay}
                    includeAllOption
                    onSelect={setTempBarangay}
                    onClose={() => setBarangayVisible(false)}
                />
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    sheet: {
        maxHeight: "85%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
    },

    barangaySheet: {
        maxHeight: "80%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#D0D0D0",
        alignSelf: "center",
        marginBottom: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    title: {
        fontSize: 21,
        fontWeight: "700",
        color: "#222222",
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    section: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 12,
    },

    optionRow: {
        flexDirection: "row",
        gap: 24,
    },

    optionList: {
        gap: 12,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 4,
    },

    optionText: {
        fontSize: 15,
        color: "#444444",
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#BBBBBB",
        alignItems: "center",
        justifyContent: "center",
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#BBBBBB",
        alignItems: "center",
        justifyContent: "center",
    },

    selectedControl: {
        backgroundColor: "#C62828",
        borderColor: "#C62828",
    },

    barangaySelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
    },

    barangayText: {
        fontSize: 15,
        color: "#333333",
    },

    placeholder: {
        color: "#888888",
    },

    footer: {
        flexDirection: "row",
        gap: 10,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    clearButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
    },

    clearButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555555",
    },

    applyButton: {
        flex: 2,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: "#C62828",
        alignItems: "center",
    },

    applyButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    barangayOption: {
        minHeight: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    barangayOptionText: {
        fontSize: 15,
        color: "#333333",
    },
});