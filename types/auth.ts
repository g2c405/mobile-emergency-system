import { ReactNode } from "react";
import { User } from "./user";
export interface LoginRequest{
    username: string,
    password: string
}

export interface RegisterRequest{
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    contact_number: string,
    residential_barangay: string
}

export type RegisterFormData = RegisterRequest & {
    confirm_password: string;
};

export interface LoginResponse{
    token: string,
}

export interface AuthContextType{
    user: User | null;
    token: string | null;
    initializing: boolean;
    loading: boolean;
    login: (data: LoginRequest)=> Promise<void>;
    register: (data: RegisterRequest)=> Promise<void>;
    logout: ()=> Promise<void>;
    updateUser: (user: User) => void;
}

export interface AuthProviderProps{
    children: ReactNode
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface ChangeEmailRequest {
    new_email: string;
}

export interface ChangeContactNumberRequest {
    contact_number: string;
}