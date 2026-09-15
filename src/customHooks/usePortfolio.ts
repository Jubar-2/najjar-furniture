import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface PortfolioImage {
    url: string;
    publicId: string;
}

export interface PortfolioContent {
    paragraph?: string;
    image1: PortfolioImage;
    image2: PortfolioImage;
    image3: PortfolioImage;
    image4: PortfolioImage;
    image5: PortfolioImage;
    image6: PortfolioImage;
}

export const HOME_PORTFOLIO_QUERY_KEY = ["home-portfolio"] as const;

export const useGetPortfolio = () => {
    return useQuery<PortfolioContent>({
        queryKey: HOME_PORTFOLIO_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/control-panel/page/home/portfolio");
            return data.data?.content;
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export const useUpdatePortfolio = () =>
    useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.patch(
                "/api/control-panel/page/home/portfolio",
                formData
            );
            return data;
        },
    });
