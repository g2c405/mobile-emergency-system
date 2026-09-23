import { getNotifcation } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    Text,
    View
} from "react-native";

export default function NotificationDetailScreen(){
    const {id} = useLocalSearchParams<{id: string}>();
    const notificationId = Number(id);
    const{
        data: notification,
        isLoading,
        isError,
        refetch,
        isRefetching
    } = useQuery<Notification>({
        queryKey: ['notification'],
        queryFn: ()=> getNotifcation(notificationId),
        enabled: Number.isFinite(notificationId)

    });

    if(isLoading){
        return(
            <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ActivityIndicator/>
            </View>
        );
    }
    if(!isError || !notification){
        return(
            <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}>
                <Text>Faield to load notification.</Text>
            </View>
        );
    }
    return(
        <View style={{
                flex: 1,
                padding: 20,
            }}>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 12,
                }}
            >
                {notification.title}
            </Text>

            <Text
                style={{
                    fontSize: 16,
                    marginBottom: 16,
                }}
            >
                {notification.message}
            </Text>

            <Text
                style={{
                    fontSize: 13,
                }}
            >
                {new Date(
                    notification.created_at
                ).toLocaleString()}
            </Text>
        </View>
    );
}