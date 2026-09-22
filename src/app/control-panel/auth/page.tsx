"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck,
    Lock,
    Mail,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    ArrowLeft,
    ShieldAlert,
    Cpu,
    Fingerprint,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { SignInInput, SignInSchema } from "@/validations/signIn";
import Logo from "@/assets/image/logo/brand-logo.png";
import bannerImg from "@/assets/image/banner/banner.jpg";

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInInput>({
        resolver: zodResolver(SignInSchema),
    });

    const onSubmit = async (data: SignInInput) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });

            if (res?.error) {
                setAuthError("Invalid credentials. Please verify your email and security key.");
                setIsLoading(false);
            } else {
                setAuthSuccess(true);
                router.push("/control-panel");
                router.refresh();
            }
        } catch (error) {
            console.error("Authentication error:", error);
            setAuthError("Authentication service is temporarily unreachable. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0B0C10] text-neutral-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="w-full z-30 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition-colors group"
                >
                    <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Live Storefront</span>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        System Online
                    </span>
                </div>
            </header>

            {/* Main Interactive Grid */}
            <main className="grow grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-57px)]">
                {/* Left Side: Brand Heritage & Atelier Showcase (Hidden on small screens) */}
                <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-white/5">
                    {/* Background Visual with Darkened Vignette */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={bannerImg}
                            alt="Najjar Furniture Atelier"
                            fill
                            priority
                            className="object-cover object-center opacity-25 scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0B0C10] via-[#0B0C10]/80 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#0B0C10]/60 to-[#0B0C10]" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Top Heritage Badge */}
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="size-11 rounded-full overflow-hidden border border-amber-500/40 shadow-lg shadow-amber-900/30 shrink-0">
                                <Image
                                    src={Logo}
                                    alt="Najjar Furniture Logo"
                                    width={44}
                                    height={44}
                                    className="object-cover size-full"
                                />
                            </div>
                            <div>
                                <h2 className="text-base font-black tracking-wider uppercase text-white font-serif">
                                    Najjar Furniture
                                </h2>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-amber-400/90 font-semibold font-mono">
                                    Atelier & Bespoke Studio
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Center Brand Statement */}
                    <div className="relative z-10 max-w-xl space-y-6 my-auto py-12">
                        <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/25 px-3.5 py-1 text-xs font-semibold rounded-full gap-1.5 backdrop-blur-sm">
                            <Sparkles className="size-3 text-amber-400" />
                            <span>Executive Studio Suite</span>
                        </Badge>

                        <h1 className="text-3xl xl:text-5xl font-black tracking-tight text-white font-serif leading-[1.15]">
                            Where Heritage Craft Meets Modern Precision.
                        </h1>

                        <p className="text-sm xl:text-base text-neutral-300/80 leading-relaxed font-normal">
                            Access the administrative command suite to manage bespoke furniture commissions,
                            update catalog collections, review client testimonials, and monitor studio operations.
                        </p>

                        {/* Security Feature Pillars */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                            <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 backdrop-blur-xs">
                                <Fingerprint className="size-4 text-amber-400 mb-2" />
                                <div className="text-xs font-bold text-white">256-Bit TLS</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">End-to-end encrypted</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 backdrop-blur-xs">
                                <ShieldCheck className="size-4 text-emerald-400 mb-2" />
                                <div className="text-xs font-bold text-white">Role Access</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">Super admin security</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 backdrop-blur-xs">
                                <Cpu className="size-4 text-amber-300 mb-2" />
                                <div className="text-xs font-bold text-white">Cloud Sync</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">Live store automation</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Micro Copy */}
                    <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 pt-6 border-t border-white/5">
                        <span className="italic font-serif text-neutral-400">
                            &ldquo;Craftsmanship that endures generations.&rdquo;
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                            v2.4 Atelier OS
                        </span>
                    </div>
                </section>

                {/* Right Side: Authentication Form Terminal */}
                <section className="col-span-1 lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-14 relative">
                    {/* Ambient Glow behind form */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-md relative z-10 space-y-6"
                    >
                        {/* Terminal Header */}
                        <div className="space-y-2 text-center sm:text-left">
                            <div className="inline-flex lg:hidden items-center justify-center size-14 rounded-full overflow-hidden border border-amber-500/40 shadow-lg shadow-amber-900/30 mb-2 mx-auto">
                                <Image
                                    src={Logo}
                                    alt="Najjar Furniture Logo"
                                    width={56}
                                    height={56}
                                    className="object-cover size-full"
                                />
                            </div>

                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                    <ShieldCheck className="size-4" />
                                </span>
                                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
                                    Restricted Gateway
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
                                Command Center Login
                            </h2>

                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Enter your master credentials to initialize your authenticated administrative session.
                            </p>
                        </div>

                        {/* Error Alert */}
                        <AnimatePresence>
                            {authError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -6 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -6 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-3 shadow-lg shadow-red-950/20">
                                        <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-medium leading-relaxed">
                                            {authError}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success State */}
                        <AnimatePresence>
                            {authSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3 shadow-lg shadow-emerald-950/20"
                                >
                                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                    <div className="flex-1 font-medium">
                                        Identity confirmed. Loading command center…
                                    </div>
                                    <Loader2 className="size-4 animate-spin text-emerald-400 shrink-0" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#14161E]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-5">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="admin-email"
                                        className="text-[11px] font-semibold text-neutral-300 tracking-wide flex items-center justify-between"
                                    >
                                        <span>Master Email Address</span>
                                        <span className="text-amber-500/80 font-mono text-[10px]">*required</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <Input
                                            id="admin-email"
                                            {...register("email")}
                                            type="email"
                                            autoComplete="email"
                                            disabled={isLoading || authSuccess}
                                            placeholder="admin@example.com"
                                            className={`h-12 pl-10 pr-4 rounded-xl bg-white/4 border text-xs text-white transition-all ${errors.email
                                                ? "border-red-500 focus-visible:ring-red-500/20"
                                                : "focus:border-amber-500 focus-visible:ring-amber-500/20"
                                                }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                                            <AlertCircle className="size-3 shrink-0" />
                                            <span>{errors.email.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="admin-password"
                                        className="text-[11px] font-semibold text-neutral-300 tracking-wide flex items-center justify-between"
                                    >
                                        <span>Security Access Key</span>
                                        <span className="text-amber-500/80 font-mono text-[10px]">*required</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <Input
                                            id="admin-password"
                                            {...register("password")}
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            disabled={isLoading || authSuccess}
                                            placeholder="••••••••••••"
                                            className={`h-12 pl-10 pr-10 rounded-xl border text-xs placeholder:text-neutral-500 transition-all focus:bg-white/[0.07] ${errors.password
                                                ? "border-red-500 focus-visible:ring-red-500/20"
                                                : "focus:border-amber-500 focus-visible:ring-amber-500/20"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-0.5"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 pt-0.5">
                                            <AlertCircle className="size-3 shrink-0" />
                                            <span>{errors.password.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Security Banner */}
                                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/80 flex items-start gap-2.5">
                                    <ShieldAlert className="size-4 text-amber-400 shrink-0 mt-0.5" />
                                    <span className="leading-snug">
                                        Private administrator area. All access attempts are strictly verified and monitored.
                                    </span>
                                </div>

                                {/* Submit Action */}
                                <Button
                                    type="submit"
                                    disabled={isLoading || authSuccess}
                                    className="w-full h-12 rounded-xl bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-950/50 transition-all hover:shadow-amber-600/25 active:scale-[0.99] cursor-pointer group"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="size-4 animate-spin text-white" />
                                            <span>Verifying Credentials…</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Sign In to Atelier Command</span>
                                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Footer Security Seal */}
                        <div className="pt-2 text-center space-y-1">
                            <p className="text-[11px] text-neutral-400">
                                Protected by Najjar Security Core • End-to-End Cryptography
                            </p>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}