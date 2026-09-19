"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Container from "@/components/utils/Container";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Armchair,
    Sparkles,
    Columns2,
    LayoutGrid,
    ArrowRight,
    MessageCircle,
    Check,
} from "lucide-react";
import PortfolioCard from "./PortfolioCard";

export interface PortfolioItem {
    _id: string;
    title: string;
    category?: string;
    description: string;
    image: string;
    subImages?: [string, string, string] | string[];
    createdAt?: string;
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "").trim();
}

function PortfolioGridSkeleton({ viewMode }: { viewMode: "large" | "grid" }) {
    const isLarge = viewMode === "large";
    return (
        <div
            className={`grid ${
                isLarge
                    ? "grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }`}
        >
            {Array.from({ length: isLarge ? 4 : 6 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 space-y-4 shadow-xs"
                >
                    <Skeleton className="aspect-16/10 w-full rounded-xl" />
                    <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="aspect-4/3 w-full rounded-lg" />
                        <Skeleton className="aspect-4/3 w-full rounded-lg" />
                        <Skeleton className="aspect-4/3 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2 pt-2 text-center">
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                        <Skeleton className="h-3 w-4/5 mx-auto" />
                        <Skeleton className="h-3 w-3/5 mx-auto" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PortfolioGrid({
    initialItems,
}: {
    initialItems?: PortfolioItem[];
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selected, setSelected] = useState<PortfolioItem | null>(null);
    const [modalActiveImage, setModalActiveImage] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"large" | "grid">("large");

    const handleOpenDetail = (item: PortfolioItem) => {
        setSelected(item);
        setModalActiveImage(item.image);
    };

    // Directly fetch from public /api/portfolio endpoint using axios
    const { data: items = [], isLoading } = useQuery<PortfolioItem[]>({
        queryKey: ["portfolio-items"],
        queryFn: async () => {
            const { data } = await axios.get("/api/portfolio");
            return data.data ?? [];
        },
        initialData: initialItems,
        staleTime: 5 * 60 * 1000,
    });

    // Extract unique categories for filter pills
    const categories = useMemo(() => {
        const set = new Set<string>();
        items.forEach((item) => {
            if (item.category?.trim()) {
                set.add(item.category.trim());
            }
        });
        return ["All", ...Array.from(set)];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (selectedCategory === "All") return items;
        return items.filter((item) => item.category?.trim() === selectedCategory);
    }, [items, selectedCategory]);

    return (
        <section className="bg-white py-12 sm:py-16">
            <Container>
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ead9] px-3 py-1 text-xs font-medium text-[#602100] mb-3">
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>Featured Works</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3a2c22]">
                        Our Masterpieces & Custom Projects
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Explore our showcase of handcrafted furniture pieces, thoughtfully designed and precision-crafted for homes and spaces.
                    </p>
                </div>

                {/* Filter & View Mode Controls Bar */}
                <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCategory === category
                                        ? "bg-[#602100] text-white shadow-sm shadow-amber-950/20"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* View Mode Toggle: Large View vs Grid View */}
                    <div className="flex items-center gap-1 rounded-full bg-neutral-100/90 p-1 border border-neutral-200/70 shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode("large")}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                viewMode === "large"
                                    ? "bg-[#602100] text-white shadow-xs"
                                    : "text-neutral-600 hover:text-neutral-900"
                            }`}
                            title="Large showcase mode"
                        >
                            <Columns2 className="size-3.5" />
                            <span className="hidden sm:inline">Large View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                viewMode === "grid"
                                    ? "bg-[#602100] text-white shadow-xs"
                                    : "text-neutral-600 hover:text-neutral-900"
                            }`}
                            title="Standard grid mode"
                        >
                            <LayoutGrid className="size-3.5" />
                            <span className="hidden sm:inline">Grid View</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <PortfolioGridSkeleton viewMode={viewMode} />
                ) : filteredItems.length > 0 ? (
                    <div
                        className={`grid ${
                            viewMode === "large"
                                ? "grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        }`}
                    >
                        {filteredItems.map((item) => (
                            <PortfolioCard
                                key={item._id}
                                mainImage={item.image}
                                subImages={item.subImages}
                                title={item.title}
                                description={item.description}
                                category={item.category}
                                onClick={() => handleOpenDetail(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-10 text-center space-y-3">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                            <Armchair className="size-6" />
                        </div>
                        <h3 className="text-base font-semibold text-neutral-800">
                            No portfolio items found
                        </h3>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                            {selectedCategory !== "All"
                                ? `No items available under "${selectedCategory}". Try choosing "All".`
                                : "New custom furniture projects will appear here once added in the control panel."}
                        </p>
                    </div>
                )}
            </Container>

            {/* Item Detail Modal - Large, Responsive, Luxury Showcase */}
            {selected && (
                <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                    <DialogContent className="max-w-5xl lg:max-w-6xl w-[96vw] sm:w-[94vw] max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xl bg-white gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                            {/* Left Gallery (7 cols on desktop) */}
                            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                                {/* Hero Active Image */}
                                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 shadow-sm group">
                                    <Image
                                        src={modalActiveImage || selected.image}
                                        alt={selected.title}
                                        fill
                                        sizes="(max-width: 1024px) 96vw, 65vw"
                                        className="object-cover transition-all duration-300 group-hover:scale-102"
                                        priority
                                    />
                                    {selected.category && (
                                        <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-xs font-medium text-white shadow-xs">
                                            {selected.category}
                                        </span>
                                    )}
                                </div>

                                {/* Thumbnail Switcher (4 slots: Main + 3 sub-images) */}
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalActiveImage(selected.image)}
                                        aria-label="View main photo"
                                        className={`relative aspect-4/3 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all cursor-pointer ${
                                            (modalActiveImage || selected.image) === selected.image
                                                ? "border-[#602100] ring-2 ring-[#602100]/30 scale-[1.02] shadow-xs"
                                                : "border-neutral-200/80 opacity-70 hover:opacity-100 hover:scale-[1.02]"
                                        }`}
                                    >
                                        <Image
                                            src={selected.image}
                                            alt="Main hero preview"
                                            fill
                                            sizes="160px"
                                            className="object-cover"
                                        />
                                    </button>

                                    {/* 3 sub-images with fallback */}
                                    {(() => {
                                        const list =
                                            selected.subImages && selected.subImages.length > 0
                                                ? [...selected.subImages]
                                                : [selected.image, selected.image, selected.image];
                                        while (list.length < 3) {
                                            list.push(selected.image);
                                        }
                                        return list.slice(0, 3).map((sub, idx) => {
                                            const src = typeof sub === "string" ? sub : (sub as any)?.url || "";
                                            const isActive = modalActiveImage === src;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setModalActiveImage(src)}
                                                    aria-label={`View detail photo ${idx + 1}`}
                                                    className={`relative aspect-4/3 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all cursor-pointer ${
                                                        isActive
                                                            ? "border-[#602100] ring-2 ring-[#602100]/30 scale-[1.02] shadow-xs"
                                                            : "border-neutral-200/80 opacity-70 hover:opacity-100 hover:scale-[1.02]"
                                                    }`}
                                                >
                                                    <Image
                                                        src={src}
                                                        alt={`${selected.title} detail ${idx + 1}`}
                                                        fill
                                                        sizes="160px"
                                                        className="object-cover"
                                                    />
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            {/* Right Info & Inquiries (5 cols on desktop) */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                                <div>
                                    <DialogHeader className="text-left space-y-2">
                                        {selected.category && (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ead9] px-3 py-1 text-xs font-semibold text-[#602100] w-fit">
                                                <Sparkles className="size-3.5 text-amber-700" />
                                                <span>{selected.category}</span>
                                            </div>
                                        )}
                                        <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-[#602100] tracking-tight">
                                            {selected.title}
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="h-0.5 w-12 bg-amber-700/30 my-3" />

                                    {/* Description */}
                                    <div className="prose prose-sm prose-slate max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed max-h-56 overflow-y-auto pr-2">
                                        {stripHtml(selected.description)}
                                    </div>

                                    {/* Specifications / Highlights */}
                                    <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2.5 text-xs sm:text-sm text-neutral-600">
                                        <div className="flex items-center gap-2">
                                            <Check className="size-4 text-[#602100] shrink-0" />
                                            <span>Handcrafted with genuine solid natural wood</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="size-4 text-[#602100] shrink-0" />
                                            <span>Custom dimensions, colors & finishes upon request</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="size-4 text-[#602100] shrink-0" />
                                            <span>Meticulously sanded, assembled, and protected</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Call to action buttons */}
                                <div className="pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/contact-us"
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#602100] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#4a1900] transition-colors"
                                    >
                                        <span>Inquire About This Piece</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <a
                                        href={`https://wa.me/8801?text=${encodeURIComponent(
                                            `Hello Najjar Furniture! I am interested in custom ordering or learning more about the "${selected.title}" piece from your portfolio.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                                    >
                                        <MessageCircle className="size-4 text-emerald-600" />
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}