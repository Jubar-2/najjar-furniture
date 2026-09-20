import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { ChangeEmailInput, ChangePasswordInput } from "@/schemas/account.schema";

export interface AdminProfile {
    id: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export const ADMIN_ACCOUNT_QUERY_KEY = ["admin-account"] as const;

export const useGetAdminAccount = () => {
    return useQuery<AdminProfile | null>({
        queryKey: ADMIN_ACCOUNT_QUERY_KEY,
        queryFn: async () => {
            try {
                const { data } = await axios.get("/api/control-panel/account");
                return data?.data ?? null;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 404)) {
                    return null;
                }
                throw err;
            }
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateAdminEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ChangeEmailInput) => {
            const { data } = await axios.put("/api/control-panel/account", {
                action: "change-email",
                ...payload,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_ACCOUNT_QUERY_KEY });
        },
    });
};

export const useUpdateAdminPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ChangePasswordInput) => {
            const { data } = await axios.put("/api/control-panel/account", {
                action: "change-password",
                ...payload,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_ACCOUNT_QUERY_KEY });
        },
    });
};

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.message) return data.message;
        if (typeof data?.errors === "string") return data.errors;
    }
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred. Please try again.";
}
