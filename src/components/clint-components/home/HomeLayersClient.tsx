"use client";

import WoodFurnitureBanner from "@/components/app/home/WoodFurnitureBanner";
import SoodFurniture from "@/assets/image/product/wood-furniture.png";
import { useGetLayer1 } from "@/customHooks/useHomeLayer1";
import { useGetLayer2 } from "@/customHooks/useHomeLayer2";

export default function HomeLayersClient() {
    const { data: layer1 } = useGetLayer1();
    const { data: layer2 } = useGetLayer2();

    return (
        <>
            <WoodFurnitureBanner
                imageSrc={layer1?.image || SoodFurniture}
                title={layer1?.heading || "Wood Furniture"}
                description={
                    layer1?.paragraph ||
                    "Premium handcrafted wooden furniture, designed with precision and made to last."
                }
                backgroundColor="bg-[#F2EBE0B2]"
                textColor="text-[#000000]"
                headingColor="text-[#462514]"
            />

            <WoodFurnitureBanner
                imageSrc={layer2?.image || SoodFurniture}
                backgroundColor="bg-[#6161613D]"
                title={layer2?.heading || "Our Collection"}
                description={
                    layer2?.paragraph ||
                    "Explore our collection of timeless wooden furniture, crafted with quality, elegance, and attention to detail."
                }
                textColor="text-[#000000]"
                headingColor="text-[#462514]"
            />
        </>
    );
}
