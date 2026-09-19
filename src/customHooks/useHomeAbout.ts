import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AboutImage {
    url?: string;
    publicId?: string;
}

export interface AboutContent {
    paragraph?: string;
    image?: AboutImage;
}

export const HOME_ABOUT_QUERY_KEY = ["home-about"] as const;

export const useGetHomeAbout = () => {
    return useQuery<AboutContent | null>({
        queryKey: HOME_ABOUT_QUERY_KEY,
        queryFn: async () => {
            try {
                const { data } = await axios.get("/api/page/home/about");
                return data.data?.content ?? null;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return null;
                }
                const message = axios.isAxiosError(err)
                    ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
                    : "Failed to load.";
                throw new Error(message);
            }
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
