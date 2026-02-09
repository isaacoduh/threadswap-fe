import { api } from "@/api/client";

import {
    CreateListingRequest,
    CreateListingResponse,
    GetListingsResponse,
    GetListingResponse,
    UpdateListingRequest,
    UpdateListingResponse,
    DeleteListingResponse,
    UpdateListingStatusRequest,
    UpdateStatusResponse,
    ListingFilters,
} from "../types";


export const listingsApi = {
    // POST /api/v1/listings (multipart/form-data for image upload)
    create: async(payload: CreateListingRequest): Promise<CreateListingResponse> => {
        const formData = new FormData()
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("price", payload.price.toString());
        formData.append("category", payload.category);
        formData.append("size", payload.size)
        formData.append("condition", payload.condition);
        if(payload.brand) formData.append("brand", payload.brand);
        if(payload.color) formData.append("color", payload.color);
        if(payload.status) formData.append("status", payload.status);
        payload.images.forEach((file) => formData.append("images", file));

        const {data} = await api.post<CreateListingResponse>("/listings", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    },

    // GET /api/v1/listings
    getAll: async(filters?: ListingFilters): Promise<GetListingsResponse> => {
        const {data} = await api.get<GetListingsResponse>("/listings", {
            params: filters,
        })
        return data;
    },

    // GET /api/v1/listings/:id
    getById: async (id: string): Promise<GetListingResponse> => {
        const { data } = await api.get<GetListingResponse>(`/listings/${id}`);
        return data;
    },

    // PATCH /api/v1/listings/:id
    update: async (id: string, payload: UpdateListingRequest): Promise<UpdateListingResponse> => {
        const { data } = await api.patch<UpdateListingResponse>(`/listings/${id}`, payload);
        return data;
    },

    // DELETE /api/v1/listings/:id
    delete: async (id: string): Promise<DeleteListingResponse> => {
        const { data } = await api.delete<DeleteListingResponse>(`/listings/${id}`);
        return data;
    },

    // PATCH /api/v1/listings/:id/status
    updateStatus: async (id: string, payload: UpdateListingStatusRequest): Promise<UpdateStatusResponse> => {
        const { data } = await api.patch<UpdateStatusResponse>(`/listings/${id}/status`, payload);
        return data;
    },

    // GET /api/v1/users/:userId/listings
    getByUser: async (userId: string, filters?: ListingFilters): Promise<GetListingsResponse> => {
        const { data } = await api.get<GetListingsResponse>(`/users/${userId}/listings`, {
            params: filters,
        });
        return data;
    },
}