"use client";

import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useState } from "react";

if (typeof window !== "undefined") {
    // Disable window focus listener to prevent background refetches when switching browser tabs
    focusManager.setEventListener(() => () => {});
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}