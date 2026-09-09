"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Lock,
    Mail,
    ArrowRight,
    Loader2,
    ChevronLeft,
    ShieldAlert
} from "lucide-react";
// import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Internal Logic
import { SignInInput, SignInSchema } from "@/validations/signIn";

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignInInput>({
        resolver: zodResolver(SignInSchema)
    });

    const onSubmit = async (data: SignInInput) => {
        setIsLoading(true);
        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });
            console.log(res)
            if (res?.error) {
                // toast.error("Access Denied", {
                //     description: "Invalid admin credentials or insufficient permissions."
                // });
            } else {
                // toast.success("Identity Verified", {
                //     description: "Welcome to the Command Center, Admin."
                // });
                router.push("/control-panel");
                router.refresh();
            }
        } catch (error) {
            // toast.error("System Error", { description: "Auth service is currently unreachable." });
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-poppins selection:bg-slate-900 selection:text-white">

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full relative z-10"
                style={{ maxWidth: "450px" }}
            >
                <Card className="bg-white border-none shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-900 p-10 text-white flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                            <ShieldCheck size={32} className="text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-[0.2em]">
                                Admin Portal
                            </Badge>
                            <h1 className="text-2xl font-black tracking-tight">NexShop Command</h1>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Master Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <Input
                                        {...register("email")}
                                        disabled={isLoading}
                                        placeholder="admin@nexshop.com"
                                        className={`h-14 pl-12 rounded-2xl border-2 transition-all font-semibold ${errors.email ? 'border-red-500 focus-visible:ring-red-500/10' : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus-visible:ring-0'}`}
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.email.message}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Security Key</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className={`h-14 pl-12 rounded-2xl border-2 transition-all font-semibold ${errors.password ? 'border-red-500 focus-visible:ring-red-500/10' : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus-visible:ring-0'}`}
                                    />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.password.message}</p>}
                            </div>

                            {/* 2FA Notice (Professional Detail) */}
                            <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                <ShieldAlert className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                <p className="text-[11px] font-medium text-blue-800 leading-relaxed uppercase tracking-tight">
                                    Authorized access only. All login attempts are logged with IP and hardware fingerprinting.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-black h-16 rounded-2xl text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-95 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>Verify Identity <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} /></>
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <button className="text-[10px] font-black text-slate-300 hover:text-slate-500 uppercase tracking-[0.2em] transition-colors">
                                Systems Status: Online
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}