import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface PortfolioItem {
  _id: string;
  title: string;
  category?: string;
  description: string;
  image: string;
  createdAt?: string;
}

export const PORTFOLIO_ITEMS_QUERY_KEY = ["portfolio-items"] as const;

export const useGetPortfolioItems = () => {
  return useQuery<PortfolioItem[]>({
    queryKey: PORTFOLIO_ITEMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get("/api/portfolio");
      return data.data ?? [];
    },
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreatePortfolioItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post("/api/control-panel/portfolio", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_ITEMS_QUERY_KEY });
    },
  });
};

export const useUpdatePortfolioItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await axios.patch(`/api/control-panel/portfolio/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_ITEMS_QUERY_KEY });
    },
  });
};

export const useDeletePortfolioItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/control-panel/portfolio/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_ITEMS_QUERY_KEY });
    },
  });
};