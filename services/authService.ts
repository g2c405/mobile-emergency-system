import { ChangePasswordRequest, LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
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

export async function changePassword(data: ChangePasswordRequest){
    const response = await api.post("users/change-password/", data);
    return response.data;
}