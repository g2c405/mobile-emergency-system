import * as Location from "expo-location";

export default async function getCurrentLocation() {
    const { status } =
        await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        throw new Error("Location permission was denied.");
    }

    const location =
        await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });

    return {
        latitude: Number(location.coords.latitude.toFixed(6)),
        longitude: Number(location.coords.longitude.toFixed(6)),
    };
}