import {
    ChangeContactNumberRequest,
    ChangeEmailRequest,
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from "@/types/auth";
import { User } from "@/types/user";
import api from "./api";
export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("users/login/",data);
    return response.data;
}
export async function register(data: RegisterRequest): Promise<void> {
    await api.post<void>("users/register/",data);
}
export async function logout(): Promise<void> {
    await api.post("users/logout/");
}
export async function me(): Promise<User>{
    const response = await api.get<User>("users/me/");
    return response.data;
}
export const forgotPassword = async (email: string) => {
    const response = await api.post(
        "/users/forgot-password/",
        {
            email,
        }
    );
    return response.data;
};

export const resetPassword = async (
    userId: string,
    token: string,
    newPassword: string
) => {
    const response = await api.post(
        "/users/reset-password/",
        {
            user_id: userId,
            token,
            new_password: newPassword,
        }
    );

    return response.data;
};

export async function changePassword(data: ChangePasswordRequest){
    const response = await api.post("users/change-password/", data);
    return response.data;
}

export async function changeEmail(
    data: ChangeEmailRequest
) {
    const response = await api.post(
        "users/change-email/",
        data
    );

    return response.data;
}

export async function changeContactNumber(
    data: ChangeContactNumberRequest
) {
    console.log("CHANGE CONTACT NUMBER REQUEST:", data);

    try {
        const response = await api.post(
            "users/change-contact-number/",
            data
        );

        console.log(
            "CHANGE CONTACT NUMBER RESPONSE:",
            response.status,
            response.data
        );

        return response.data;
    } catch (error: any) {
        console.log("CHANGE CONTACT NUMBER FAILED");
        console.log("MESSAGE:", error.message);
        console.log("CODE:", error.code);
        console.log("URL:", error.config?.url);
        console.log("BASE URL:", error.config?.baseURL);
        console.log("FULL URL:", error.config?.baseURL + error.config?.url);
        console.log("REQUEST DATA:", error.config?.data);
        console.log("RESPONSE:", error.response);
        console.log("REQUEST:", error.request);

        throw error;
    }
}