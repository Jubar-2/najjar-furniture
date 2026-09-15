"use client";

import Gallery from "@/components/app/home/Gallery";
import { useGetGallery } from "@/customHooks/getGallery";

export default function HomeGalleryClient() {
    const { data, isLoading } = useGetGallery();

    return <Gallery isLoading={isLoading} images={data?.images} imagesSub={data?.imagesSub} />;
}
