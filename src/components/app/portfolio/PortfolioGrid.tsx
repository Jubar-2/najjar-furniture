"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Container from "@/components/utils/Container";
import { useGetPortfolioItems } from "@/customHooks/usePortfolioItems";
import type { PortfolioItem } from "@/customHooks/usePortfolioItems";

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "").trim();
}

export default function PortfolioGrid() {
    const { data: items, isLoading } = useGetPortfolioItems();
    const [selected, setSelected] = useState<PortfolioItem | null>(null);

    return (
        <section className="bg-white py-16">
            <Container>
                {isLoading ? (
                    <p className="text-sm text-neutral-500">Loading…</p>
                ) : items && items.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => setSelected(item)}
                                className="group overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left shadow-sm transition-shadow hover:shadow-xl"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-[#602100]">{item.title}</h3>
                                    {item.category && (
                                        <span className="mt-1 inline-block rounded-full bg-[#f2ead9] px-2.5 py-0.5 text-[11px] font-medium text-[#3a2c22]">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500">No portfolio items available yet.</p>
                )}
            </Container>

            {selected && (
                <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                    <DialogContent className="max-w-2xl gap-5 sm:max-w-2xl">
                        <div className="relative aspect-video overflow-hidden rounded-xl">
                            <Image src={selected.image} alt={selected.title} fill className="object-cover" />
                        </div>
                        <DialogHeader>
                            <DialogTitle>{selected.title}</DialogTitle>
                            {selected.category && (
                                <span className="mt-1 inline-block w-fit rounded-full bg-[#f2ead9] px-2.5 py-0.5 text-[11px] font-medium text-[#3a2c22]">
                                    {selected.category}
                                </span>
                            )}
                        </DialogHeader>
                        <p className="text-sm leading-relaxed text-neutral-600">
                            {stripHtml(selected.description)}
                        </p>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}