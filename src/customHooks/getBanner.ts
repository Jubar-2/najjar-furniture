import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface HeroContent {
    heading: string;
    paragraph: string;
    banner: string;
    bannerPublicId?: string;
}

export const HOME_HERO_QUERY_KEY = ["home-hero"] as const;

export const useGetBanner = () => {
    return useQuery<HeroContent>({
        queryKey: HOME_HERO_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get(`/api/page/home/hero`);
            return data.data?.content;
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export const useUpdateBanner = () => useMutation({
    mutationFn: async (formData: FormData) => {
        await axios.patch("/api/control-panel/page/home/hero", formData);
    }
});