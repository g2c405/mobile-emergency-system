import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    legalContent,
    LegalDocumentType,
} from "@/constants/legalContent";

interface LegalDocumentProps {
    visible: boolean;
    documentType: LegalDocumentType;
    onClose: () => void;
}

export default function LegalDocument({
    visible,
    documentType,
    onClose,
}: LegalDocumentProps) {
    const document = legalContent[documentType];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>
                                {document.title}
                            </Text>

                            <Text style={styles.updated}>
                                Last updated: {document.lastUpdated}
                            </Text>
                        </View>

                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Close legal document"
                            hitSlop={8}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#222222"
                            />
                        </Pressable>
                    </View>

                    {/* Scrollable document */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.subtitle}>
                            {document.subtitle}
                        </Text>

                        {document.sections.map((section, index) => (
                            <View
                                key={`${documentType}-${index}`}
                                style={styles.section}
                            >
                                <Text style={styles.sectionHeading}>
                                    {section.heading}
                                </Text>

                                <Text style={styles.sectionBody}>
                                    {section.body}
                                </Text>
                            </View>
                        ))}

                        <View style={styles.closingContainer}>
                            <Text style={styles.closingText}>
                                {document.closingStatement}
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Fixed close button */}
                    <View style={styles.footer}>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.doneButton,
                                pressed && styles.buttonPressed,
                            ]}
                            accessibilityRole="button"
                        >
                            <Text style={styles.doneButtonText}>
                                Close
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },

    headerText: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222222",
    },

    updated: {
        fontSize: 12,
        color: "#888888",
        marginTop: 5,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEEEEE",
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 22,
        paddingBottom: 28,
    },

    subtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: "#888888",
        marginBottom: 26,
    },

    section: {
        marginBottom: 24,
    },

    sectionHeading: {
        fontSize: 16,
        lineHeight: 23,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 8,
    },

    sectionBody: {
        fontSize: 14,
        lineHeight: 23,
        color: "#555555",
    },

    closingContainer: {
        backgroundColor: "#EEEEEE",
        borderRadius: 12,
        padding: 16,
        marginTop: 4,
    },

    closingText: {
        fontSize: 13,
        lineHeight: 21,
        color: "#444444",
        fontWeight: "500",
    },

    footer: {
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",
        backgroundColor: "#F8F8F8",
    },

    doneButton: {
        minHeight: 50,
        borderRadius: 10,
        backgroundColor: "#222222",
        alignItems: "center",
        justifyContent: "center",
    },

    doneButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },

    buttonPressed: {
        opacity: 0.8,
    },
});
