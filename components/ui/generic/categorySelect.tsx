import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export const INCIDENT_CATEGORIES = [
    {
        value: "road_accident",
        label: "Road Accident",
        description: "Vehicle collisions and road-related accidents",
        icon: "car-outline",
    },
    {
        value: "fire",
        label: "Fire",
        description: "House fires and other fire incidents",
        icon: "flame-outline",
    },
    {
        value: "natural_hazard",
        label: "Flooding and Natural Hazards",
        description: "Floods, fallen trees, and storm damage",
        icon: "thunderstorm-outline",
    },
    {
        value: "medical_emergency",
        label: "Medical Emergency",
        description: "Sudden illness, collapse, or serious injury",
        icon: "medkit-outline",
    },
    {
        value: "infrastructure_hazard",
        label: "Infrastructure Hazard",
        description: "Damaged roads, downed wires, and unsafe structures",
        icon: "warning-outline",
    },
    {
        value: "public_safety",
        label: "Public Safety Incident",
        description: "Disturbances and other community safety concerns",
        icon: "shield-outline",
    },
    {
        value: "other",
        label: "Other",
        description: "Incidents not covered by the other categories",
        icon: "ellipsis-horizontal-circle-outline",
    },
] as const;

export type IncidentCategory =
    (typeof INCIDENT_CATEGORIES)[number]["value"];

interface CategorySelectModalProps {
    visible: boolean;
    value: IncidentCategory | null;
    onSelect: (category: IncidentCategory) => void;
    onClose: () => void;
}

export default function CategorySelectModal({
    visible,
    value,
    onSelect,
    onClose,
}: CategorySelectModalProps) {
    function handleSelect(category: IncidentCategory) {
        onSelect(category);
        onClose();
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
                            Select Incident Category
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
                        showsVerticalScrollIndicator={false}
                    >
                        {INCIDENT_CATEGORIES.map((category) => {
                            const selected =
                                value === category.value;

                            return (
                                <Pressable
                                    key={category.value}
                                    style={[
                                        styles.option,
                                        selected &&
                                            styles.optionSelected,
                                    ]}
                                    onPress={() =>
                                        handleSelect(category.value)
                                    }
                                >
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={category.icon}
                                            size={23}
                                            color={
                                                selected
                                                    ? "#C62828"
                                                    : "#666666"
                                            }
                                        />
                                    </View>

                                    <View style={styles.optionContent}>
                                        <Text
                                            style={[
                                                styles.optionTitle,
                                                selected &&
                                                    styles.optionTitleSelected,
                                            ]}
                                        >
                                            {category.label}
                                        </Text>

                                        <Text style={styles.optionDescription}>
                                            {category.description}
                                        </Text>
                                    </View>

                                    {selected && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={22}
                                            color="#C62828"
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
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
        height: "80%",
        maxHeight: 560,
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
        fontSize: 19,
        fontWeight: "700",
        color: "#222222",
    },

    option: {
        minHeight: 76,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    optionSelected: {
        backgroundColor: "#FFF5F5",
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
    },

    optionContent: {
        flex: 1,
    },

    optionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333333",
    },

    optionTitleSelected: {
        color: "#C62828",
    },

    optionDescription: {
        fontSize: 12,
        color: "#888888",
        marginTop: 4,
        lineHeight: 17,
    },
});
