import ProfileInfoRow from "@/components/ui/profile/profileInfoRow";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
    const { user, logout, loading } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
               <View style={styles.header}>
                    <Text style={styles.heading}>
                        Profile
                    </Text>

                    <Text style={styles.subtitle}>
                        Manage your account and personal information.
                    </Text>
                </View>

                {/* Profile Card */}
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {`${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`.toUpperCase()}
                            </Text>
                        </View>

                        <Text style={styles.name}>
                            {user.first_name} {user.last_name}
                        </Text>

                        <Text style={styles.username}>
                            @{user.username}
                        </Text>

                        <Text style={styles.email}>
                            {user.email}
                        </Text>
                    </View>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Personal Information
                    </Text>

                    <ProfileInfoRow
                        icon="person-outline"
                        label="First name"
                        value={user.first_name}
                    />

                    <ProfileInfoRow
                        icon="person-outline"
                        label="Last name"
                        value={user.last_name}
                    />

                    <ProfileInfoRow
                        icon="call-outline"
                        label="Contact number"
                        value={user.contact_number}
                    />

                    <ProfileInfoRow
                        icon="location-outline"
                        label="Barangay"
                        value={user.residential_barangay}
                        last
                    />
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Account
                    </Text>

                    <ProfileInfoRow
                        icon="at-outline"
                        label="Username"
                        value={`@${user.username}`}
                    />

                    <ProfileInfoRow
                        icon="mail-outline"
                        label="Email"
                        value={user.email}
                        last
                    />
                </View>

                {/* Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Actions
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.actionPressed,
                        ]}
                        onPress={() => {
                            router.push('/changePassword');
                        }}
                    >
                        <View style={styles.actionLeft}>
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color="#555555"
                            />

                            <Text style={styles.actionText}>
                                Change password
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#AAAAAA"
                        />
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionRow,
                            styles.logoutRow,
                            pressed && styles.logoutPressed,
                        ]}
                        onPress={logout}
                        disabled={loading}
                    >
                        <View style={styles.actionLeft}>
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color="#D32F2F"
                            />

                            <Text style={styles.logoutText}>
                                {loading
                                    ? "Logging out..."
                                    : "Log out"}
                            </Text>
                        </View>
                    </Pressable>
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

    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },

    profileHeader: {
        alignItems: "center",
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#607D8B",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    avatarText: {
        fontSize: 30,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    name: {
        fontSize: 21,
        fontWeight: "700",
        color: "#222222",
    },

    username: {
        fontSize: 14,
        color: "#666666",
        marginTop: 3,
    },

    email: {
        fontSize: 14,
        color: "#888888",
        marginTop: 2,
    },

    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingTop: 18,
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222222",
        marginBottom: 8,
    },

    actionRow: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    actionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    actionText: {
        fontSize: 15,
        color: "#333333",
    },

    actionPressed: {
        opacity: 0.6,
    },

    logoutRow: {
        marginTop: 2,
    },

    logoutPressed: {
        opacity: 0.6,
    },

    logoutText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#D32F2F",
    },
    subtitle: {
        fontSize: 14,
        color: "#888888",
        marginTop: 5,
    },
    header: {
        marginBottom: 20,
    },

    heading: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222222",
    },
});