import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
            const res = await fetch(`/api/control-panel/page/${pageName}`);
            if (!res.ok) throw new Error("Failed to load content.");
            const json = await res.json();
            return json.data?.content ?? null;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useSavePageContent = (pageName: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: string) => {
            const res = await fetch(`/api/control-panel/page/${pageName}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Save failed.");
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pageContentQueryKey(pageName) });
        },
    });
};