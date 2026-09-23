import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
const LOCAL_URL = "http://192.168.100.7:8000/api/";
const PROD_URL = "https://api.aksyon.online/api/";
export const BASE_URL = PROD_URL;
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {"Content-Type": "application/json"}
});

api.interceptors.request.use(async (config) => {

    const networkState = await NetInfo.fetch();
    console.log("NETWORK STATE:", networkState.isConnected);
    if (!networkState.isConnected) {
        throw new axios.Cancel("NO_INTERNET");
    }

    const token = await SecureStore.getItemAsync("token");

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
});
export default api;