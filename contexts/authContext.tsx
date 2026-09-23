import * as authService from "@/services/authService";
import { AuthContextType, AuthProviderProps, LoginRequest, RegisterRequest } from "@/types/auth";
import { User } from "@/types/user";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext<AuthContextType | null>(null);

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

    async function register(data: RegisterRequest): Promise<void>{
        setLoading(true);
        try{
            await authService.register(data);
        }
        finally{
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
    useEffect(()=>{
        void restoreSession();
    },[]);

    async function logout(){
        setLoading(true);
        try{
            await authService.logout();
        }
        catch(error){
            console.error("Logout failed.", error)
            
        }
        finally{
            await SecureStore.deleteItemAsync("token");
            setToken(null);
            setUser(null);
            setLoading(false);
        }
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
        }}>{children}</AuthContext.Provider>
    )
}