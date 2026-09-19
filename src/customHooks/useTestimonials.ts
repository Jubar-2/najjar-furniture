import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Testimonial {
    _id: string;
    name: string;
    location: string;
    message: string;
    avatar?: string;
    createdAt?: string;
}

export const HOME_TESTIMONIALS_QUERY_KEY = ["home-testimonials"] as const;

export const useGetTestimonials = () => {
    return useQuery<Testimonial[]>({
        queryKey: HOME_TESTIMONIALS_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/testimonials");
            return data.data ?? [];
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.post("/api/control-panel/testimonials", formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HOME_TESTIMONIALS_QUERY_KEY });
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            const { data } = await axios.patch(`/api/control-panel/testimonials/${id}`, formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HOME_TESTIMONIALS_QUERY_KEY });
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.delete(`/api/control-panel/testimonials/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HOME_TESTIMONIALS_QUERY_KEY });
        },
    });
};
