import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface PageMetaRecord {
  pageName: string;
  route: string;
  label: string;
  title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  meta_og_image: string;
  meta_author: string;
}

export const PAGE_META_QUERY_KEY = ["page-meta"] as const;

export const useGetPageMeta = () => {
  return useQuery<PageMetaRecord[]>({
    queryKey: PAGE_META_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get("/api/meta");
      return data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdatePageMeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pageName,
      payload,
    }: {
      pageName: string;
      payload: Partial<
        Pick<
          PageMetaRecord,
          "title" | "meta_title" | "meta_description" | "meta_keywords" | "meta_og_image" | "meta_author"
        >
      >;
    }) => {
      const { data } = await axios.patch(`/api/control-panel/meta/${pageName}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGE_META_QUERY_KEY });
    },
  });
};