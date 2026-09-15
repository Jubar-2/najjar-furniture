"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeLayerThreeForm from "./Homelayerthreeform";
import LayerForm from "./LayerForm";

const LAYERS = [
    { value: "1", label: "Layer 1" },
    { value: "2", label: "Layer 2" },
    { value: "3", label: "Layer 3" },
] as const;

export default function HomeLayersAdmin() {
    return (
        <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Home Layers</h2>

            <Tabs defaultValue="1">
                <TabsList>
                    {LAYERS.map((layer) => (
                        <TabsTrigger key={layer.value} value={layer.value}>
                            {layer.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="1" className="mt-6">
                    <LayerForm layer="1" />
                </TabsContent>
                <TabsContent value="2" className="mt-6">
                    <LayerForm layer="2" />
                </TabsContent>

                {/* Layer 3 is a different shape entirely — 6 independent
                    heading/paragraph/image items on a fixed endpoint, not a
                    single heading/paragraph/image on a /:layer route like
                    1 and 2 — so it gets its own dedicated form component
                    rather than reusing LayerForm with the wrong data shape. */}
                <TabsContent value="3" className="mt-6">
                    <HomeLayerThreeForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}