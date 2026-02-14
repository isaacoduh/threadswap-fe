import { api } from "@/api/client";
import { GetProfileResponse, PatchProfileRequest, PatchProfileResponse, UploadAvatarResponse } from "../types";

export const profileApi = {

    // GET /api/v1/users/:id
    getById: async (id: string): Promise<GetProfileResponse> => {
        const {data} = await api.get<GetProfileResponse>(`/users/${id}`)
        return data;
    },

    // PATCH /api/v1/users/:id
    update: async(id: string, payload: PatchProfileRequest): Promise<PatchProfileResponse> => {
        const {data} = await api.patch<PatchProfileResponse>(`/users/${id}`, payload);
        return data;
    },

    // POST /api/v1/users/:id/avatar
    uploadAvatar: async(id: string, file: File): Promise<UploadAvatarResponse> => {
        const formData = new FormData();
        formData.append("avatar", file);

        const {data} = await api.post<UploadAvatarResponse>(`/users/${id}/avatar`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })


        return data;
    }
}