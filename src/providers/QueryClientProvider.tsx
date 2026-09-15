"use client";

import { QueryClient, QueryClientProvider as QueryClientWrapper } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
    // useState (not a plain `new QueryClient()`) so the client is created
    // exactly once per component instance and survives re-renders. Creating
    // it inline in the render body would give you a brand-new client (and
    // wipe the cache) on every re-render.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute — avoid instant refetch-on-mount right after hydration
                    },
                },
            })
    );

    return <QueryClientWrapper client={queryClient}>{children}</QueryClientWrapper>;
}