import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Layer3Item {
    heading: string;
    paragraph: string;
    image: string;
    imagePublicId?: string;
}

export interface Layer3Content {
    item1: Layer3Item;
    item2: Layer3Item;
    item3: Layer3Item;
    item4: Layer3Item;
    item5: Layer3Item;
    item6: Layer3Item;
}

export const HOME_LAYER3_QUERY_KEY = ["home-layer3"] as const;

export const useGetLayer3 = () => {
    return useQuery<Layer3Content>({
        queryKey: HOME_LAYER3_QUERY_KEY,
        queryFn: async () => {
            const { data } = await axios.get("/api/page/home/layer3");
            return data.data?.content;
        },
        staleTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateLayer3 = () =>
    useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await axios.patch(
                "/api/control-panel/page/home/layer3",
                formData
            );
            return data;
        },
    });

export const useUpdateLayer3Item = (itemNumber: number | string) =>
    useMutation({
        mutationFn: async (data: FormData | Record<string, unknown>) => {
            const num = String(itemNumber).replace(/^item/i, "");
            const isFormData = data instanceof FormData;
            const res = await axios.post(
                `/api/control-panel/page/home/layer3/item/${num}`,
                data,
                isFormData ? undefined : { headers: { "Content-Type": "application/json" } }
            );
            return res.data;
        },
    });

