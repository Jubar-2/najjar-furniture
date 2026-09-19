import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ContactSection, ContactMessageStatus } from "@/schemas/contact.schema";

export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    topic: string;
    message: string;
    status: ContactMessageStatus;
    createdAt?: string;
}

export const CONTACT_QUERY_KEY = ["contact"] as const;
export const CONTACT_MESSAGES_QUERY_KEY = ["contact-messages"] as const;

export const useGetContact = () => {
    return useQuery<ContactSection | null>({
        queryKey: CONTACT_QUERY_KEY,
        queryFn: async () => {
            try {
                const { data } = await axios.get("/api/contact");
                return data?.data?.content ?? null;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return null;
                }
                throw new Error("Failed to load contact settings.");
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useSaveContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content: ContactSection) => {
            const { data } = await axios.patch("/api/control-panel/contact", content);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEY });
        },
    });
};

export const useGetContactMessages = () => {
    return useQuery<ContactMessage[]>({
        queryKey: CONTACT_MESSAGES_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/control-panel/contact/messages");
            return data?.data ?? [];
        },
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateContactMessageStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ContactMessageStatus }) => {
            const { data } = await axios.patch(`/api/control-panel/contact/messages/${id}`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
        },
    });
};

export const useDeleteContactMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.delete(`/api/control-panel/contact/messages/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
        },
    });
};