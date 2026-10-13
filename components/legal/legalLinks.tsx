import { useState } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

import LegalDocument from "@/components/legal/legalDocument";
import type { LegalDocumentType } from "@/constants/legalContent";

interface LegalLinksProps {
    layout?: "row" | "column";
    containerStyle?: StyleProp<ViewStyle>;
}

export default function LegalLinks({
    layout = "row",
    containerStyle,
}: LegalLinksProps) {
    const [selectedDocument, setSelectedDocument] =
        useState<LegalDocumentType | null>(null);

    function openDocument(type: LegalDocumentType) {
        setSelectedDocument(type);
    }

    function closeDocument() {
        setSelectedDocument(null);
    }

    return (
        <>
            <View
                style={[
                    styles.container,
                    layout === "column" && styles.column,
                    containerStyle,
                ]}
            >
                <Pressable
                    onPress={() => openDocument("terms")}
                    accessibilityRole="link"
                    accessibilityLabel="View Terms and Conditions"
                    hitSlop={6}
                >
                    {({ pressed }) => (
                        <Text
                            style={[
                                styles.link,
                                pressed && styles.linkPressed,
                            ]}
                        >
                            Terms and Conditions
                        </Text>
                    )}
                </Pressable>

                {layout === "row" && (
                    <Text style={styles.separator}>·</Text>
                )}

                <Pressable
                    onPress={() => openDocument("privacy")}
                    accessibilityRole="link"
                    accessibilityLabel="View Privacy Policy"
                    hitSlop={6}
                >
                    {({ pressed }) => (
                        <Text
                            style={[
                                styles.link,
                                pressed && styles.linkPressed,
                            ]}
                        >
                            Privacy Policy
                        </Text>
                    )}
                </Pressable>
            </View>

            <LegalDocument
                visible={selectedDocument !== null}
                documentType={selectedDocument ?? "terms"}
                onClose={closeDocument}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
    },

    column: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
    },

    link: {
        fontSize: 12,
        lineHeight: 20,
        color: "#666666",
        textDecorationLine: "underline",
        textDecorationColor: "#AAAAAA",
    },

    linkPressed: {
        color: "#222222",
    },

    separator: {
        fontSize: 13,
        color: "#AAAAAA",
    },
});