import * as authService from "@/services/authService";
import {
    deactivatePushDevice,
    registerDeviceForPushNotifications,
} from "@/services/notificationService";
import { AuthContextType, AuthProviderProps, LoginRequest, RegisterRequest, RegisterResponse } from "@/types/auth";
import { User } from "@/types/user";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext<AuthContextType | null>(null);

let onAuthenticationFailure: (() => void) | null = null;

export function setAuthenticationFailureHandler(
    handler: (() => void) | null
) {
    onAuthenticationFailure = handler;
}

export function handleAuthenticationFailure() {
    onAuthenticationFailure?.();
}

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<User|null>(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string|null>(null);

    async function login(data: LoginRequest){
        setLoading(true);
        try{
            const response = await authService.login(data);
            console.log("LOGIN RESPONSE: ", response);
            await SecureStore.setItemAsync("token", response.token);
            setToken(response.token);
            const user = await authService.me();
            console.log("ME RESPONSE:", user);
            setUser(user);
        }
        finally{
            setLoading(false);
        }
    }

    async function register(
        data: RegisterRequest
    ): Promise<RegisterResponse> {
        setLoading(true);

        try {
            return await authService.register(data);
        }
        finally {
            setLoading(false);
        }
    }
    
    async function restoreSession(){
        try{
            const storedToken = await SecureStore.getItemAsync("token");
            if(!storedToken){
                return;
            }
            setToken(storedToken);
            const user = await authService.me();
            setUser(user);
        }
        catch(error){
            console.error("Failed to restore session:", error);
            await SecureStore.deleteItemAsync("token");
            setToken(null);
            setUser(null);
        }
        finally{
            setInitializing(false);
        }

    }

    async function clearSession() {
        await SecureStore.deleteItemAsync("token");
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        setAuthenticationFailureHandler(() => {
            void clearSession();
        });

        return () => {
            setAuthenticationFailureHandler(null);
        };
    }, []);

    useEffect(()=>{
        void restoreSession();
    },[]);

    useEffect(() => {
        if (initializing || !user || !token) {
            return;
        }

        void registerDeviceForPushNotifications();

    }, [initializing, user?.id, token]);

   async function logout() {
        setLoading(true);

        try {
            // Deactivate this device's push token first.
            try {
                await deactivatePushDevice();
            } catch (error) {
                console.error(
                    "Failed to deactivate push device:",
                    error
                );
            }

            // Perform your existing backend logout.
            try {
                await authService.logout();
            } catch (error) {
                console.error("Logout failed.", error);
            }

        } finally {
            await SecureStore.deleteItemAsync("token");
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    }
    function updateUser(user: User) {
        setUser(user);
    }
    return(
        <AuthContext.Provider value={{
            user,
            token,
            initializing,
            loading,
            login,
            register,
            logout,
            updateUser,
        }}>{children}</AuthContext.Provider>
    )
}