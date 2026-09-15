import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
            const res = await fetch("/api/control-panel/contact");
            if (!res.ok) throw new Error("Failed to load contact settings.");
            const json = await res.json();
            return json.data?.content ?? null;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useSaveContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content: ContactSection) => {
            const res = await fetch("/api/control-panel/contact", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Save failed.");
            return json;
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
            const res = await fetch("/api/control-panel/contact/messages");
            if (!res.ok) throw new Error("Failed to load messages.");
            const json = await res.json();
            return json.data ?? [];
        },
        staleTime: 30 * 1000,
    });
};

export const useUpdateContactMessageStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ContactMessageStatus }) => {
            const res = await fetch(`/api/control-panel/contact/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Update failed.");
            return json;
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
            const res = await fetch(`/api/control-panel/contact/messages/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Delete failed.");
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY });
        },
    });
};