import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { PatchProfileRequest } from "../types";

export const profileKeys = {
    all: ["profiles"] as const,
    detail: (id: string) => [...profileKeys.all, id] as const
}

// GET /api/v1/users/:id
export const useUserProfile = (id: string) => {
    return useQuery({
        queryKey: profileKeys.detail(id),
        queryFn: () => profileApi.getById(id),
        enabled: !!id
    })
}

// PATCH /api/v1/users/:id
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: PatchProfileRequest}) => 
            profileApi.update(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: profileKeys.detail(variables.id)});
        }
        
    })
}

// POST /api/v1/users/:id/avatar
export const useUploadAvatar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, file}: {id: string, file: File}) => profileApi.uploadAvatar(id, file),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: profileKeys.detail(variables.id)})
        }
    })
}