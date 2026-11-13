import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PAGE_META_QUERY_KEY } from "./usePageMeta";

export interface SeoSettingsData {
  google_site_verification: string;
}

export const SEO_SETTINGS_QUERY_KEY = ["seo-settings"] as const;

export const useGetSeoSettings = () => {
  return useQuery<SeoSettingsData>({
    queryKey: SEO_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get("/api/control-panel/seo-settings");
      return data.data ?? { google_site_verification: "" };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateSeoSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      google_site_verification,
    }: {
      google_site_verification: string;
    }) => {
      const { data } = await axios.patch("/api/control-panel/seo-settings", {
        google_site_verification,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEO_SETTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAGE_META_QUERY_KEY });
    },
  });
};

