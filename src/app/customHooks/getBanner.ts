import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetBanner = () => {
    return useQuery({
        queryKey: ["home-banner"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/page/home/hero`);
            return data.data;
        },
        staleTime: 15 * 1000 * 60,
        refetchOnWindowFocus: true,
    });
}

interface Payload {
    paragraph: string;
    heading: string;
    banner: File;
}

export const useUpdateBanner = () => useMutation({
    mutationFn: async (payload: Payload) => {
        await axios.patch("/api/control-panel/page/home/hero", payload);
    }
});