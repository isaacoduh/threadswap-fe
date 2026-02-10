import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listingsApi } from "../api/listingsApi";
import { CreateListingRequest, UpdateListingRequest, UpdateListingStatusRequest, ListingFilters } from "../types";

// Query key factory for consistent cache management
export const listingKeys = {
    all: ["listings"] as const,
    lists: () => [...listingKeys.all, "list"] as const,
    list: (filters?: ListingFilters) => [...listingKeys.lists(), filters] as const,
    details: () => [...listingKeys.all, 'detail'] as const,
    detail: (id: string) => [...listingKeys.details(), id] as const,
    byUser: (userId: string, filters?: ListingFilters) => [...listingKeys.all, "user", userId, filters] as const
}

// GET /api/v1/listings
export const useListings = (filters?: ListingFilters) => {
    return useQuery({
        queryKey: listingKeys.list(filters),
        queryFn: () => listingsApi.getAll(filters),
    });
};

// GET /api/v1/listings/:id
export const useListing = (id: string) => {
    return useQuery({
        queryKey: listingKeys.detail(id),
        queryFn: () => listingsApi.getById(id),
        enabled: !!id,
    });
};

// GET /api/v1/users/:userId/listings
export const useUserListings = (userId: string, filters?: ListingFilters) => {
    return useQuery({
        queryKey: listingKeys.byUser(userId, filters),
        queryFn: () => listingsApi.getByUser(userId, filters),
        enabled: !!userId
    });
};

// POST /api/v1/listings
export const useCreateListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateListingRequest) => listingsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: listingKeys.lists()})
        },
    });
};

// PATCH /api/v1/listings/:id
export const useUpdateListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: UpdateListingRequest}) => listingsApi.update(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: listingKeys.detail(variables.id)});
            queryClient.invalidateQueries({queryKey: listingKeys.lists()})
        }
    })
}


// DELETE /api/v1/listings/:id
export const useDeleteListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => listingsApi.delete(id),
        onSuccess: (_data, id) => {
            queryClient.removeQueries({queryKey: listingKeys.detail(id)});
            queryClient.invalidateQueries({queryKey: listingKeys.lists()});
        },
    });
};


// PATCH /api/v1/listings/:id/status
export const useUpdateListingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: UpdateListingStatusRequest}) => listingsApi.updateStatus(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: listingKeys.detail(variables.id)});
            queryClient.invalidateQueries({queryKey: listingKeys.lists()});
        },
    });
};