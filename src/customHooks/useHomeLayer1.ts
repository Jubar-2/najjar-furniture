import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Layer1Content {
    heading: string;
    paragraph: string;
    image: string;
}

export const HOME_LAYER1_QUERY_KEY = ["home-layer1"] as const;

export const useGetLayer1 = () => {
    return useQuery<Layer1Content>({
        queryKey: HOME_LAYER1_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/page/home/layer1");
            return data.data?.content;
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateLayer1 = () =>
    useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.patch(
                "/api/control-panel/page/home/layer1",
                formData
            );
            return data;
        },
    });
