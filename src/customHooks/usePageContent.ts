import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface PageContent {
    body: string;
}

export const PAGE_CONTENT_QUERY_KEY = ["page-content"] as const;

export const pageContentQueryKey = (pageName: string) =>
    [...PAGE_CONTENT_QUERY_KEY, pageName] as const;

export const useGetPageContent = (pageName: string) => {
    return useQuery<PageContent | null>({
        queryKey: pageContentQueryKey(pageName),
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/page/${pageName}`);
                return data.data?.content ?? null;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return null;
                }
                throw new Error("Failed to load content.");
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useSavePageContent = (pageName: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: string) => {
            const { data } = await axios.patch(`/api/control-panel/page/${pageName}`, { body });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pageContentQueryKey(pageName) });
        },
    });
};