"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  AlertCircle,
  Armchair,
  MessageSquareQuote,
  Search,
  ExternalLink,
  RefreshCw,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Trash2,
  Reply,
  CheckCircle2,
  Calendar,
  Sparkles,
  PanelsTopLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetContactMessages,
  useUpdateContactMessageStatus,
  useDeleteContactMessage,
  useGetContact,
  type ContactMessage,
} from "@/customHooks/useContact";
import { useGetPortfolioItems } from "@/customHooks/usePortfolioItems";
import { useGetTestimonials } from "@/customHooks/useTestimonials";
import type { ContactMessageStatus } from "@/schemas/contact.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ContactMessageStatus,
  { label: string; badge: string; dot: string }
> = {
  new: {
    label: "New",
    badge: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
  },
  read: {
    label: "In Review",
    badge: "bg-sky-50 text-sky-700 border-sky-200/80",
    dot: "bg-sky-500",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
};

const CHART_COLORS = ["#d97706", "#0284c7", "#059669", "#7c3aed", "#e11d48", "#475569"];

export default function OverviewPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Queries
  const { data: messages = [], isLoading: isMessagesLoading, refetch: refetchMessages } =
    useGetContactMessages();
  const { data: portfolioItems = [] } = useGetPortfolioItems();
  const { data: testimonials = [] } = useGetTestimonials();
  const { data: contactInfo } = useGetContact();

  // Mutations
  const updateStatusMutation = useUpdateContactMessageStatus();
  const deleteMutation = useDeleteContactMessage();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactMessageStatus>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchMessages(),
        queryClient.invalidateQueries({ queryKey: ["portfolio-items"] }),
        queryClient.invalidateQueries({ queryKey: ["home-testimonials"] }),
        queryClient.invalidateQueries({ queryKey: ["contact"] }),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Status Counts
  const newCount = useMemo(
    () => messages.filter((m) => m.status === "new").length,
    [messages]
  );
  const readCount = useMemo(
    () => messages.filter((m) => m.status === "read").length,
    [messages]
  );
  const resolvedCount = useMemo(
    () => messages.filter((m) => m.status === "resolved").length,
    [messages]
  );

  // Unique Topics for Filter
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => {
      if (m.topic) set.add(m.topic);
    });
    return Array.from(set);
  }, [messages]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesStatus =
        statusFilter === "all" ? true : m.status === statusFilter;
      const matchesTopic =
        topicFilter === "all" ? true : m.topic === topicFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        m.name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.topic?.toLowerCase().includes(query) ||
        m.message?.toLowerCase().includes(query);
      return matchesStatus && matchesTopic && matchesSearch;
    });
  }, [messages, statusFilter, topicFilter, searchQuery]);

  // Topic distribution for Recharts
  const topicData = useMemo(() => {
    const counts: Record<string, number> = {};
    messages.forEach((m) => {
      const topic = m.topic || "General";
      counts[topic] = (counts[topic] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [messages]);

  // Status breakdown for Pie Chart
  const statusPieData = useMemo(() => {
    return [
      { name: "New", value: newCount, color: "#f59e0b" },
      { name: "In Review", value: readCount, color: "#0284c7" },
      { name: "Resolved", value: resolvedCount, color: "#10b981" },
    ].filter((item) => item.value > 0);
  }, [newCount, readCount, resolvedCount]);

  // Status change handler
  const handleStatusChange = async (message: ContactMessage, status: ContactMessageStatus) => {
    setActionError(null);
    try {
      await updateStatusMutation.mutateAsync({ id: message._id, status });
      if (selectedMessage?._id === message._id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (id: string) => {
    setActionError(null);
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete message.");
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="grow p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto">
      {/* --- TOP BANNER / HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[28px] border border-slate-200/70 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-50 text-amber-800 border-amber-200/80 font-bold px-2.5 py-0.5 text-[11px] uppercase tracking-wider">
              Studio Command Center
            </Badge>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium" suppressHydrationWarning>
              <Calendar size={13} /> {todayFormatted}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Najjar Furniture Atelier
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage bespoke commissions, customer inquiries, and studio performance in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
          >
            <RefreshCw
              size={15}
              className={cn("mr-1.5", isRefreshing && "animate-spin text-amber-600")}
            />
            <span>{isRefreshing ? "Refreshing…" : "Refresh"}</span>
          </Button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink size={13} />
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/control-panel/auth" })}
            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold border border-red-100/80"
          >
            <LogOut size={15} className="mr-1.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 flex items-center justify-between">
          <span>{actionError}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActionError(null)}
            className="text-red-700 hover:bg-red-100"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Inquiries */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Inbox size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{messages.length}</div>
          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">{resolvedCount} resolved</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{newCount} pending</span>
          </p>
        </Card>

        {/* Needs Attention */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Needs Attention
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <span>{newCount}</span>
            {newCount > 0 && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {newCount > 0 ? "Pending customer inquiries" : "All inquiries addressed!"}
          </p>
        </Card>

        {/* Portfolio Collections */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Masterpieces
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Armchair size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {portfolioItems.length}
          </div>
          <Link
            href="/control-panel/portfolio"
            className="text-xs text-emerald-700 font-bold inline-flex items-center hover:underline"
          >
            Manage catalog <ChevronRight size={12} className="ml-0.5" />
          </Link>
        </Card>

        {/* Client Reviews */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Client Reviews
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <MessageSquareQuote size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {testimonials.length}
          </div>
          <Link
            href="/control-panel/testimonials"
            className="text-xs text-purple-700 font-bold inline-flex items-center hover:underline"
          >
            View reviews <ChevronRight size={12} className="ml-0.5" />
          </Link>
        </Card>
      </div>

      {/* --- INQUIRIES & MESSAGES SHOWCASE (PRIMARY FOCUS) --- */}
      <Card className="bg-white border-slate-200/80 shadow-xs rounded-[28px] overflow-hidden">
        <CardHeader className="p-6 md:p-8 pb-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Inbox className="text-amber-600" size={22} />
                  Client Inquiries & Commission Messages
                </CardTitle>
                <Badge variant="outline" className="font-bold text-xs bg-slate-50">
                  {filteredMessages.length} showing
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Direct submissions from the public website contact form with real-time status management.
              </CardDescription>
            </div>

            {/* Quick search input */}
            <div className="relative w-full lg:w-72">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, topic…"
                className="pl-9.5 h-10 rounded-xl border-slate-200 text-xs focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  statusFilter === "all"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setStatusFilter("new")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                  statusFilter === "new"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                New ({newCount})
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                  statusFilter === "read"
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                In Review ({readCount})
              </button>
              <button
                onClick={() => setStatusFilter("resolved")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                  statusFilter === "resolved"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Resolved ({resolvedCount})
              </button>
            </div>

            {/* Topic Filter */}
            {availableTopics.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="h-8.5 rounded-lg border bg-white px-2.5 text-xs text-slate-700 outline-none font-medium focus:border-slate-400"
                >
                  <option value="all">All Topics</option>
                  {availableTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Table / List View */}
        <div className="divide-y divide-slate-100">
          {isMessagesLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-amber-600" />
              <span>Loading messages…</span>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((m) => {
              const statusCfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.new;
              const dateStr = m.createdAt
                ? new Date(m.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                : "Recent";

              return (
                <div
                  key={m._id}
                  className="p-4 md:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Client Info & Snippet */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                      <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xs uppercase">
                        {m.name ? m.name.slice(0, 2) : "CL"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Mail size={12} />
                          {m.email}
                        </a>
                        <Badge
                          variant="outline"
                          className="bg-amber-50/50 text-amber-800 border-amber-200/60 text-[11px] font-semibold"
                        >
                          {m.topic}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                            statusCfg.badge
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                          {statusCfg.label}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-medium ml-auto md:ml-0" suppressHydrationWarning>
                          {dateStr}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-3xl">
                        &ldquo;{m.message}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Status Dropdown */}
                    <select
                      value={m.status}
                      onChange={(e) =>
                        handleStatusChange(m, e.target.value as ContactMessageStatus)
                      }
                      disabled={updateStatusMutation.isPending}
                      className="h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300"
                    >
                      <option value="new">Mark New</option>
                      <option value="read">In Review</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>

                    {/* View Details Modal Trigger */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(m)}
                      className="h-8.5 px-3 rounded-lg border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                    >
                      <Eye size={13} className="mr-1" />
                      View
                    </Button>

                    {/* Delete Message with Alert Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8.5 w-8.5 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        }
                      />
                      <AlertDialogContent className="bg-white rounded-2xl p-6">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete message?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the inquiry from{" "}
                            <strong>{m.name}</strong>. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDeleteMessage(m._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-800">No matching inquiries found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "all" || topicFilter !== "all"
                  ? "Try resetting your search filters to view all client messages."
                  : "All inquiries submitted through your storefront will appear here."}
              </p>
              {(searchQuery || statusFilter !== "all" || topicFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTopicFilter("all");
                  }}
                  className="rounded-xl text-xs font-semibold"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* --- DETAILS DIALOG MODAL --- */}
      {selectedMessage && (
        <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="sm:max-w-lg md:max-w-xl bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-2xl">
            <DialogHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-800 border-amber-200/80 font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider"
                >
                  {selectedMessage.topic}
                </Badge>
                <span className="text-xs text-slate-400 font-medium" suppressHydrationWarning>
                  {selectedMessage.createdAt
                    ? new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                    : "Recent"}
                </span>
              </div>
              <DialogTitle className="text-xl font-black text-slate-900">
                Inquiry from {selectedMessage.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Client email:{" "}
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Message Content
              </span>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedMessage,
                      e.target.value as ContactMessageStatus
                    )
                  }
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: [${selectedMessage.topic}] - Najjar Furniture`
                  )}&body=${encodeURIComponent(
                    `Hello ${selectedMessage.name},\n\nThank you for reaching out to Najjar Furniture regarding your inquiry.\n\nBest regards,\nNajjar Furniture Atelier`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Reply size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- BOTTOM SECTION: TOPICS ANALYTICS & STUDIO INFO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Breakdown Chart */}
        <Card className="lg:col-span-2 bg-white border-slate-200/80 shadow-xs rounded-[28px] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-600" />
                Inquiry Topics Distribution
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Client interest across bespoke commissions and showroom consultations
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-bold text-slate-600">
              {topicData.length} active topics
            </Badge>
          </div>

          <div className="h-64 w-full">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.07)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="count" name="Inquiries" fill="#d97706" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No inquiries data available yet.
              </div>
            )}
          </div>
        </Card>

        {/* Studio Channels & Info Card */}
        <Card className="bg-white border-slate-200/80 shadow-xs rounded-[28px] p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Armchair size={18} className="text-amber-600" />
                Studio Channels
              </CardTitle>
              <Link
                href="/control-panel/pages/contact-us"
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Edit Channels
              </Link>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Public contact coordinates displayed on your storefront for showroom visits and direct outreach.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Showroom & Atelier
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {contactInfo?.address || "Dhaka, Bangladesh"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Studio Hours
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {contactInfo?.showroomHours || "Sat–Thu, 10am–8pm"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Mail size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Primary Studio Email
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {contactInfo?.emails?.[0]?.value || "support@najjarfurniture.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-4">
            <Link href="/control-panel/pages/contact-us">
              <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-11 rounded-xl text-xs">
                Manage Contact Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* --- QUICK STUDIO SHORTCUTS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/control-panel/portfolio"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Armchair size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Portfolio Catalog</h4>
              <p className="text-[11px] text-slate-400">Add or edit masterpieces</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/control-panel/testimonials"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquareQuote size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Client Reviews</h4>
              <p className="text-[11px] text-slate-400">Manage client endorsements</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/control-panel/pages/home"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PanelsTopLeft size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Homepage Layout</h4>
              <p className="text-[11px] text-slate-400">Update hero & showcase</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/control-panel/meta"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">SEO & Metadata</h4>
              <p className="text-[11px] text-slate-400">Search ranking & sharing</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </main>
  );
}