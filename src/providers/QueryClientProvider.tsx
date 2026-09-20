"use client";

import { QueryClient, QueryClientProvider as QueryClientWrapper, focusManager } from "@tanstack/react-query";
import { useState } from "react";

if (typeof window !== "undefined") {
    // Disable window focus listener to prevent background refetches when switching browser tabs
    focusManager.setEventListener(() => () => { });
}

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
                        refetchOnWindowFocus: false, // Prevent background refetches when switching browser tabs
                    },
                },
            })
    );

    return <QueryClientWrapper client={queryClient}>{children}</QueryClientWrapper>;
}