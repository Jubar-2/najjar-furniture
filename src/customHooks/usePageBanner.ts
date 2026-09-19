import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PageBannerData } from "@/schemas/pageBanner.schema";

export const pageBannerQueryKey = (pageName: string) => ["page-banner", pageName] as const;

export function useGetPageBanner(pageName: string) {
  return useQuery<PageBannerData | null>({
    queryKey: pageBannerQueryKey(pageName),
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/control-panel/page/${pageName}/banner`);
        const content = data.data?.content ?? null;
        return content;
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return null;
        }
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
          : "Failed to load banner.";
        throw new Error(msg);
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdatePageBanner(pageName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const { data } = await axios.patch(
          `/api/control-panel/page/${pageName}/banner`,
          formData
        );
        return data;
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? err.response?.data?.error ?? err.message)
          : (err instanceof Error ? err.message : "Failed to save banner.");
        throw new Error(msg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageBannerQueryKey(pageName) });
    },
  });
}
