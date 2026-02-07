import { api } from "@/api/client";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types";

export const authApi = {
    login: async(credentials: LoginRequest): Promise<LoginResponse> => {
        const {data} = await api.post<LoginResponse>('/auth/login', credentials);
        return data;
    },
    register: async(payload: RegisterRequest): Promise<RegisterResponse> => {
        const {data} = await api.post<RegisterResponse>('/auth/register', payload);
        return data;
    }
}