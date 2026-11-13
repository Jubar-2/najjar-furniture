"use client";

import React, { useState } from "react";
import {
  SearchCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useGetSeoSettings,
  useUpdateSeoSettings,
} from "@/customHooks/useSeoSettings";
import { sanitizeGoogleVerificationCode } from "@/schemas/pageMeta.schema";

interface GoogleVerificationCardProps {
  className?: string;
}

export default function GoogleVerificationCard({ className = "" }: GoogleVerificationCardProps) {
  const { data: seoData, isLoading, isError, error } = useGetSeoSettings();
  const updateMutation = useUpdateSeoSettings();

  const savedCode = seoData?.google_site_verification || "";

  // Track user edits without requiring setState-in-effect
  const [userEditedCode, setUserEditedCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const verificationCode = userEditedCode !== null ? userEditedCode : savedCode;
  const isDirty = userEditedCode !== null && userEditedCode !== savedCode;
  const isConfigured = Boolean(savedCode.trim());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Auto-extract if user pastes a full HTML tag like <meta name="google-site-verification" content="..." />
    const cleaned = sanitizeGoogleVerificationCode(rawVal);
    setUserEditedCode(cleaned);
    setFeedback(null);
  };

  const handleReset = () => {
    setUserEditedCode(null);
    setFeedback(null);
  };

  const handleClear = async () => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({ google_site_verification: "" });
      setUserEditedCode(null);
      setFeedback({
        type: "success",
        message: "Google verification code removed. Verification meta tag is now disabled.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove verification code.";
      setFeedback({ type: "error", message: msg });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanCode = sanitizeGoogleVerificationCode(verificationCode);

    try {
      await updateMutation.mutateAsync({
        google_site_verification: cleanCode,
      });
      setUserEditedCode(null);
      setFeedback({
        type: "success",
        message: cleanCode
          ? "Google Search Console verification code saved successfully. Meta tag is now active across all public pages."
          : "Verification code removed. Meta tag is now disabled.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save verification code.";
      setFeedback({ type: "error", message: msg });
    }
  };

  return (
    <Card className={`border border-slate-200/90 bg-white shadow-xs rounded-2xl overflow-hidden ${className}`}>
      {/* Card Header */}
      <CardHeader className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200/50">
              <SearchCheck className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                SEO Settings – Google Search Console
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Manage site ownership verification for Google Search Console and webmaster tools.
              </CardDescription>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isLoading ? (
              <Badge variant="outline" className="text-xs text-slate-500 bg-slate-50 border-slate-200 py-1 px-2.5">
                <Loader2 className="size-3 animate-spin mr-1.5" /> Loading…
              </Badge>
            ) : isConfigured ? (
              <Badge variant="outline" className="text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200 py-1 px-2.5 gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Active on Website
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-medium text-slate-500 bg-slate-100/70 border-slate-200 py-1 px-2.5">
                Not Configured
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                : "bg-red-50/80 border-red-200 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{feedback.message}</div>
          </div>
        )}

        {isError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              {error instanceof Error ? error.message : "Failed to load current SEO settings."}
            </span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="google-verification-code-input"
                className="text-xs sm:text-sm font-semibold text-slate-800"
              >
                Google Search Console Verification Code
              </Label>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Open Search Console</span>
                <ExternalLink className="size-3" />
              </a>
            </div>

            <div className="relative">
              <Input
                id="google-verification-code-input"
                type="text"
                placeholder="Enter Google verification code"
                value={verificationCode}
                onChange={handleInputChange}
                disabled={isLoading || updateMutation.isPending}
                className="font-mono text-xs sm:text-sm bg-slate-50/60 focus:bg-white transition-colors pr-24"
              />
              {isDirty && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 pointer-events-none">
                  Unsaved
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter the verification code provided by Google Search Console (HTML Tag method).
            </p>
          </div>

          {/* HTML Tag Preview */}
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider font-sans border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Code2 className="size-3 text-amber-400" />
                Rendered HTML &lt;head&gt; Meta Tag
              </span>
              <span>{verificationCode.trim() ? "Active on public pages" : "Inactive"}</span>
            </div>
            <div className="overflow-x-auto whitespace-pre py-0.5 text-[11px] text-amber-200">
              {verificationCode.trim() ? (
                <code>{`<meta name="google-site-verification" content="${verificationCode.trim()}" />`}</code>
              ) : (
                <span className="text-slate-500 italic">
                  &lt;!-- Verification meta tag will be injected here once configured --&gt;
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {isConfigured && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={isLoading || updateMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 px-3 text-xs"
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  Remove Verification
                </Button>
              )}

              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isLoading || updateMutation.isPending}
                  className="text-slate-600 hover:text-slate-900 h-9 px-3 text-xs"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Revert
                </Button>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isLoading || updateMutation.isPending || (!isDirty && isConfigured)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-medium shadow-xs h-9 px-4 text-xs ml-auto"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  Save Verification Code
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
