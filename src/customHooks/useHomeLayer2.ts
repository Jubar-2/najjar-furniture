import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Layer2Content {
    heading: string;
    paragraph: string;
    image: string;
}

export const HOME_LAYER2_QUERY_KEY = ["home-layer2"] as const;

export const useGetLayer2 = () => {
    return useQuery<Layer2Content>({
        queryKey: HOME_LAYER2_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/control-panel/page/home/layer2");
            return data.data?.content;
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export const useUpdateLayer2 = () =>
    useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.patch(
                "/api/control-panel/page/home/layer2",
                formData
            );
            return data;
        },
    });
