import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface GalleryImage {
    url: string;
    publicId: string;
}

export interface GalleryContent {
    images: GalleryImage[];
    imagesSub: GalleryImage[];
}

export const useGetGallery = () => {
    return useQuery<GalleryContent>({
        queryKey: ["home-gallery"],
        queryFn: async () => {
            const { data } = await axios.get("/api/control-panel/page/home/gallary");
            return data.data?.content || { images: [], imagesSub: [] };
        },
        staleTime: 15 * 1000 * 60,
        refetchOnWindowFocus: true,
    });
};

export const useUploadGalleryImages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.patch("/api/control-panel/page/home/gallary", formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["home-gallery"] });
        },
    });
};

export const useDeleteGalleryImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ publicId, row }: { publicId: string; row: string }) => {
            const { data } = await axios.delete("/api/control-panel/page/home/gallary", {
                params: { publicId, row },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["home-gallery"] });
        },
    });
};
