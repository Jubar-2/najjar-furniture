"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Mail,
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    UserCog,
    Sparkles,
    ShieldAlert,
    Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    useGetAdminAccount,
    useUpdateAdminEmail,
    useUpdateAdminPassword,
    getErrorMessage,
} from "@/customHooks/useAdminAccount";

export default function AccountSettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const { data: adminProfile, isLoading: isProfileLoading } = useGetAdminAccount();

    const updateEmailMutation = useUpdateAdminEmail();
    const updatePasswordMutation = useUpdateAdminPassword();

    // Change Email State
    const [newEmail, setNewEmail] = useState("");
    const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
    const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState(false);
    const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
    const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);

    // Change Password State
    const [passwordCurrentPassword, setPasswordCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

    const activeEmail = adminProfile?.email || session?.user?.email || "admin@gmail.com";

    // Handle Change Email
    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailSuccessMessage(null);
        setEmailErrorMessage(null);

        const trimmedEmail = newEmail.trim().toLowerCase();

        if (!trimmedEmail) {
            setEmailErrorMessage("Please enter a new email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailErrorMessage("Please enter a valid email address format.");
            return;
        }

        if (trimmedEmail === activeEmail.toLowerCase()) {
            setEmailErrorMessage("The new email must be different from your current email.");
            return;
        }

        if (!emailCurrentPassword) {
            setEmailErrorMessage("Please enter your current password to authorize this change.");
            return;
        }

        try {
            const res = await updateEmailMutation.mutateAsync({
                newEmail: trimmedEmail,
                currentPassword: emailCurrentPassword,
            });

            const updatedEmail = res?.data?.email || trimmedEmail;

            // Synchronize active NextAuth session immediately
            if (updateSession) {
                await updateSession({ email: updatedEmail });
            }

            setEmailSuccessMessage(res?.message || "Email address updated successfully.");
            setNewEmail("");
            setEmailCurrentPassword("");
        } catch (error) {
            setEmailErrorMessage(getErrorMessage(error));
        }
    };

    // Handle Change Password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordSuccessMessage(null);
        setPasswordErrorMessage(null);

        if (!passwordCurrentPassword) {
            setPasswordErrorMessage("Please enter your current password.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordErrorMessage("New password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            setPasswordErrorMessage("New password must contain both letters and numbers.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordErrorMessage("New password and confirmation do not match.");
            return;
        }

        if (passwordCurrentPassword === newPassword) {
            setPasswordErrorMessage("New password cannot be the same as your current password.");
            return;
        }

        try {
            const res = await updatePasswordMutation.mutateAsync({
                currentPassword: passwordCurrentPassword,
                newPassword,
                confirmPassword,
            });

            setPasswordSuccessMessage(res?.message || "Password updated successfully.");
            setPasswordCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setPasswordErrorMessage(getErrorMessage(error));
        }
    };

    return (
        <div className="flex-1 min-w-0 bg-[#F0F2F5] pb-16 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">

                {/* --- Top Navigation & Header --- */}
                <div className="space-y-2">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Link href="/control-panel" className="hover:text-amber-700 transition-colors">
                            Control Panel
                        </Link>
                        <ChevronRight className="size-3.5 text-slate-400" />
                        <span className="text-slate-800 font-semibold">Account Settings</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                                Account & Security Settings
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Update your administrator login email, enhance account security, and change your password.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-3">
                                <ShieldCheck className="size-3.5 text-emerald-600" />
                                <span>Protected Access</span>
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* --- Current Account Overview Banner --- */}
                <Card className="border border-slate-200/80 bg-linear-to-r from-amber-900/90 via-stone-900 to-stone-950 text-white shadow-md overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-96 h-full bg-amber-500/10 blur-3xl pointer-events-none" />
                    <CardContent className="p-5 sm:p-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-14 sm:size-16 border-2 border-amber-400/40 shadow-inner bg-amber-800 shrink-0">
                                <AvatarFallback className="bg-amber-700 text-amber-100 font-black text-lg">
                                    {activeEmail ? activeEmail.slice(0, 2).toUpperCase() : "AD"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                                        Administrator Profile
                                    </h2>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 border border-amber-400/30">
                                        <Sparkles className="size-2.5" />
                                        Super Admin
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-1.5 break-all">
                                    <Mail className="size-3.5 text-amber-400 shrink-0" />
                                    <span>{activeEmail}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 text-right">
                            <span className="text-[11px] text-slate-400">Authentication Mode</span>
                            <span className="text-xs font-semibold text-amber-200">Credentials (Email & Password)</span>
                        </div>
                    </CardContent>
                </Card>

                {/* --- Forms Grid: Email & Password --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* ========================================================= */}
                    {/* CARD 1: CHANGE EMAIL */}
                    {/* ========================================================= */}
                    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
                        <CardHeader className="pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                                        Change Email Address
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                                        Update the primary email used to sign in to the control panel.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-5">
                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                                {emailSuccessMessage && (
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-medium">{emailSuccessMessage}</div>
                                    </div>
                                )}

                                {emailErrorMessage && (
                                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                                        <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-medium">{emailErrorMessage}</div>
                                    </div>
                                )}

                                {/* Current Email (Read only) */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-700">
                                        Current Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            value={activeEmail}
                                            disabled
                                            className="bg-slate-50 text-slate-500 font-mono text-xs pl-8 cursor-not-allowed border-slate-200"
                                        />
                                        <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        This is your currently verified administrative email.
                                    </p>
                                </div>

                                {/* New Email Input */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="new-email" className="text-xs font-semibold text-slate-700">
                                        New Email Address <span className="text-amber-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="new-email"
                                            type="email"
                                            required
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="admin@example.com"
                                            className="text-xs pl-8 focus:border-amber-600"
                                        />
                                        <Mail className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* Current Password for authorization */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="email-auth-password" className="text-xs font-semibold text-slate-700">
                                        Current Password <span className="text-amber-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email-auth-password"
                                            type={showEmailCurrentPassword ? "text" : "password"}
                                            required
                                            value={emailCurrentPassword}
                                            onChange={(e) => setEmailCurrentPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                            className="text-xs pl-8 pr-9 focus:border-amber-600"
                                        />
                                        <KeyRound className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <button
                                            type="button"
                                            onClick={() => setShowEmailCurrentPassword(!showEmailCurrentPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            title={showEmailCurrentPassword ? "Hide password" : "Show password"}
                                        >
                                            {showEmailCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Required for security verification before updating email.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={updateEmailMutation.isPending}
                                        className="w-full sm:w-auto bg-[#602100] hover:bg-[#461800] text-white font-semibold text-xs px-6 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {updateEmailMutation.isPending ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                <span>Updating Email...</span>
                                            </>
                                        ) : (
                                            <span>Save New Email</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* ========================================================= */}
                    {/* CARD 2: CHANGE PASSWORD */}
                    {/* ========================================================= */}
                    <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
                        <CardHeader className="pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                                    <KeyRound className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                                        Change Password
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                                        Update your secret password to keep your administrator account secure.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-5">
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                {passwordSuccessMessage && (
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-medium">{passwordSuccessMessage}</div>
                                    </div>
                                )}

                                {passwordErrorMessage && (
                                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                                        <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-medium">{passwordErrorMessage}</div>
                                    </div>
                                )}

                                {/* Current Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pwd-current" className="text-xs font-semibold text-slate-700">
                                        Current Password <span className="text-amber-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="pwd-current"
                                            type={showPasswordCurrent ? "text" : "password"}
                                            required
                                            value={passwordCurrentPassword}
                                            onChange={(e) => setPasswordCurrentPassword(e.target.value)}
                                            placeholder="Enter your existing password"
                                            className="text-xs pl-8 pr-9 focus:border-amber-600"
                                        />
                                        <KeyRound className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            title={showPasswordCurrent ? "Hide password" : "Show password"}
                                        >
                                            {showPasswordCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pwd-new" className="text-xs font-semibold text-slate-700">
                                        New Password <span className="text-amber-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="pwd-new"
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 8 characters with letters and numbers"
                                            className="text-xs pl-8 pr-9 focus:border-amber-600"
                                        />
                                        <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            title={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Criteria Checklist */}
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[11px]">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`size-3.5 rounded-full flex items-center justify-center text-[10px] ${newPassword.length >= 8 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                                            <Check className="size-2.5" />
                                        </span>
                                        <span className={newPassword.length >= 8 ? "text-emerald-700 font-medium" : "text-slate-500"}>
                                            At least 8 characters long
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`size-3.5 rounded-full flex items-center justify-center text-[10px] ${/[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword) ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                                            <Check className="size-2.5" />
                                        </span>
                                        <span className={/[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword) ? "text-emerald-700 font-medium" : "text-slate-500"}>
                                            Contains both letters and numbers
                                        </span>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pwd-confirm" className="text-xs font-semibold text-slate-700">
                                        Confirm New Password <span className="text-amber-600">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="pwd-confirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter your new password"
                                            className="text-xs pl-8 pr-9 focus:border-amber-600"
                                        />
                                        <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={updatePasswordMutation.isPending}
                                        className="w-full sm:w-auto bg-[#602100] hover:bg-[#461800] text-white font-semibold text-xs px-6 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {updatePasswordMutation.isPending ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                <span>Updating Password...</span>
                                            </>
                                        ) : (
                                            <span>Update Account Password</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                </div>

                {/* --- Security Advice Card --- */}
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-950">
                    <ShieldAlert className="size-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="font-bold text-amber-900">Security Best Practices</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                            Always keep your login credentials private. When changing your administrative email or password, save your updated credentials in a secure password manager. Updating your email will immediately reflect on your current session.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
