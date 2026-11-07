import {
    ChangeContactNumberRequest,
    ChangeEmailRequest,
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "@/types/auth";
import { User } from "@/types/user";
import api from "./api";
export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("users/login/",data);
    return response.data;
}
export async function register(
    data: RegisterRequest
): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
        "users/register/",
        data
    );

    return response.data;
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
): Promise<void> {
    await api.post("users/change-email/", data);
}

export async function verifyEmailChange(
    code: string
): Promise<void> {
    await api.post("users/verify-email-change/", { code });
}

export async function resendEmailChangeOTP(): Promise<void> {
    await api.post("users/resend-email-change-otp/");
}

export async function changeContactNumber(
    data: ChangeContactNumberRequest
): Promise<void> {
    await api.post("users/change-contact-number/", data);
}

export async function verifyContactNumberChange(
    code: string
): Promise<void> {
    await api.post("users/verify-contact-number-change/", { code });
}

export async function resendContactNumberChangeOTP(): Promise<void> {
    await api.post("users/resend-contact-number-change-otp/");
}

export async function verifyEmail(
    userId: number,
    code: string
): Promise<void> {
    await api.post(`users/verify-email/${userId}/`, { code });
}

export async function resendRegistrationOTP(
    userId: number
): Promise<void> {
    await api.post(`users/resend-registration-otp/${userId}/`);
}