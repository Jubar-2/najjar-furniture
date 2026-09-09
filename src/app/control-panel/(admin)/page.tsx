"use client"

import {
    Users, Briefcase, Wallet, CheckCircle2, Clock,
    AlertCircle, TrendingUp, Search, Settings,
    Bell, ShieldCheck, Menu, X, ArrowUpRight,
    PieChart as PieIcon, BarChart3
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, BarChart, Bar, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from '@/components/control-panel/Sidebar';
import Link from 'next/link';
import { boolean, string } from 'zod';
import { ReactNode } from 'react';

// --- MOCK DATA FOR GRAPHS ---
const userGrowthData = [
    { name: 'Mon', users: 400 }, { name: 'Tue', users: 600 },
    { name: 'Wed', users: 500 }, { name: 'Thu', users: 900 },
    { name: 'Fri', users: 1100 }, { name: 'Sat', users: 1500 },
    { name: 'Sun', users: 1300 },
];

const jobActivityData = [
    { name: 'W1', posted: 45, failed: 5 },
    { name: 'W2', posted: 52, failed: 8 },
    { name: 'W3', posted: 38, failed: 12 },
    { name: 'W4', posted: 65, failed: 4 },
];

const successData = [
    { name: 'Approved', value: 85, color: '#10B981' },
    { name: 'Others', value: 15, color: '#F1F5F9' },
];

export default function Overview() {
    return (
        <>

            {/* --- DESKTOP SIDEBAR --- */}
            {/* <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col sticky top-0 h-screen p-6 shadow-2xl">
                <SidebarContent />
            </aside> */}



            {/* --- MAIN CONTENT AREA --- */}
            <main className="grow p-4 md:p-8 overflow-y-auto">

                {/* TOP HEADER */}
                <div className="flex items-center justify-between mb-8 gap-4">
                    {/* <div className="flex items-center gap-4"> */}
                    {/* MOBILE DRAWER TRIGGER */}
                    {/* <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="bg-white shadow-sm rounded-xl">
                                        <Menu size={24} className="text-slate-600" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-none">
                                    <div className="p-6 h-full text-white">
                                        <SidebarContent />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">Admin Overview</h2>
                            <p className="hidden sm:block text-slate-500 font-medium text-sm mt-1">Real-time system health & analytics</p>
                        </div> */}
                    {/* </div> */}

                    <div className="flex items-center gap-3">
                        <div className="relative hidden xl:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input placeholder="Search system..." className="h-11 w-64 pl-10 rounded-xl bg-white border-none shadow-sm focus-visible:ring-emerald-500" />
                        </div>
                        <Button variant="outline" className="h-11 w-11 rounded-xl bg-white border-none shadow-sm p-0"><Bell size={20} /></Button>
                        <Avatar className="h-11 w-11 rounded-xl border-2 border-white shadow-md">
                            <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <AdminStatCard label="Total Users" val="12.4k" trend="+12%" icon={<Users />} color="blue" />
                    <AdminStatCard label="Active Jobs" val="142" trend="+5%" icon={<Briefcase />} color="emerald" />
                    <AdminStatCard label="Pending Proofs" val="89" icon={<CheckCircle2 />} color="amber" />
                    <AdminStatCard label="Withdrawals" val="৳45k" icon={<Wallet />} color="purple" />
                </div>

                {/* --- GRAPHS SECTION --- */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    {/* User Growth (Area) */}
                    <Card className="xl:col-span-2 bg-white border-none shadow-sm rounded-[32px] overflow-hidden p-6">
                        <div className="flex items-center justify-between mb-6">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-500" /> User Increment
                            </CardTitle>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">+24%</Badge>
                        </div>
                        <div className="h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94A3B8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="users" stroke="#10B981" strokeWidth={4} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Success Rate (Donut) */}
                    <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden p-6 relative flex flex-col items-center">
                        <CardTitle className="text-lg font-bold text-slate-800 self-start mb-2">Success Rate</CardTitle>
                        <div className="h-70 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={successData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                        {successData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-slate-900">85%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved</span>
                            </div>
                        </div>
                        <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Success</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /> Failed</div>
                        </div>
                    </Card>

                    {/* Job Activity (Bar) */}
                    <Card className="xl:col-span-3 bg-white border-none shadow-sm rounded-[32px] overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-8">
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 size={20} className="text-blue-500" /> Job Performance (Posted vs Failed)
                            </CardTitle>
                        </div>
                        <div className="h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={jobActivityData} barGap={12}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94A3B8' }} />
                                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="posted" name="Posted" fill="#2D3344" radius={[6, 6, 0, 0]} barSize={40} />
                                    <Bar dataKey="failed" name="Failed" fill="#D17581" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* --- ACTIONABLE CONTENT --- */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-2 bg-white border-none shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-black text-slate-800">Withdrawal Requests</CardTitle>
                            <Link href="/admin/withdrawal-requests">
                                <Button variant="ghost" className="text-blue-500 font-bold hover:bg-blue-50">View All</Button>
                            </Link>
                        </CardHeader>
                        <div className="divide-y divide-slate-50">
                            <WithdrawRow name="mdjubairrahman" amount="1,200.00" method="bKash" date="2m ago" />
                            <WithdrawRow name="emonbhuiyan" amount="550.00" method="Nagad" date="15m ago" />
                            <WithdrawRow name="biplob_2004" amount="2,100.00" method="bKash" date="1h ago" />
                        </div>
                    </Card>

                    <Card className="bg-white border-none shadow-sm rounded-[32px] overflow-hidden p-8 space-y-6">
                        <CardTitle className="text-lg font-bold text-slate-800">Recent Activity</CardTitle>
                        <LogItem icon={<Users className="text-blue-500" />} title="New User" desc="munna14447 registered." time="Just now" />
                        <LogItem icon={<ShieldCheck className="text-emerald-500" />} title="Safety Alert" desc="IP Blocked: 192.168.1.1" time="12m ago" />
                        <Button className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl">System Logs</Button>
                    </Card>
                </div>
            </main>
        </>
    );
}

// --- SHARED SIDEBAR CONTENT ---
const SidebarContent = () => (
    <>
        <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl"><Briefcase className="text-slate-900" size={24} /></div>
            <h1 className="text-xl font-black tracking-widest uppercase">Admin Panel</h1>
        </div>
        <nav className="grow space-y-2">
            <AdminNavItem icon={<TrendingUp size={20} />} label="Overview" active />
            <AdminNavItem icon={<Briefcase size={20} />} label="Manage Jobs" />
            <AdminNavItem icon={<Users size={20} />} label="User Directory" />
            <AdminNavItem icon={<Wallet size={20} />} label="Withdrawals" />
            <AdminNavItem icon={<CheckCircle2 size={20} />} label="Verifications" />
        </nav>
        <div className="pt-6 border-t border-slate-800 space-y-2">
            <AdminNavItem icon={<Settings size={20} />} label="Site Settings" />
            <button className="flex items-center gap-3 w-full p-3 text-red-400 font-bold hover:bg-white/5 rounded-xl">
                <AlertCircle size={20} /> Logout
            </button>
        </div>
    </>
);

// --- REUSABLE MINI-COMPONENTS ---
type AdminNavItemType = {
    icon: ReactNode,
    label: string,
    active?: boolean
}

const AdminNavItem = ({ icon, label, active = false }: AdminNavItemType) => (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-white text-slate-900 shadow-lg' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
        <span className={active ? 'text-emerald-500' : ''}>{icon}</span>
        <span className="font-bold text-sm">{label}</span>
    </div>
);

type AdminStatCardType = {
    icon: ReactNode,
    label: string,
    val: string,
    trend?: string,
    color: string
}

const AdminStatCard = ({ label, val, trend, icon, color }: AdminStatCardType) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        purple: "bg-purple-50 text-purple-600"
    };

    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colors[color as "blue" | "emerald" | "amber" | "purple"]}`}>
                    {icon}
                </div>
                {trend && <Badge className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] uppercase">{trend}</Badge>}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800">{val}</h3>
        </Card>
    );
};

type WithdrawRowType = {
    name: string, amount: string, method: string, date: string
}

const WithdrawRow = ({ name, amount, method, date }: WithdrawRowType) => (
    <div className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-slate-100">
                <AvatarFallback className="bg-slate-100 font-bold text-slate-500 uppercase text-xs">{name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="text-sm font-bold text-slate-800">{name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{method} • {date}</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-lg font-black text-slate-900 tracking-tighter">৳{amount}</span>
            <Button size="sm" className="hidden group-hover:flex bg-emerald-500 text-white font-bold h-8 rounded-lg px-3">Approve</Button>
        </div>
    </div>
);

type LogItemType = {
    icon: ReactNode, title: string, desc: string, time: string
}

const LogItem = ({ icon, title, desc, time }: LogItemType) => (
    <div className="flex gap-4">
        <div className="mt-1">{icon}</div>
        <div>
            <h5 className="text-sm font-bold text-slate-800 leading-tight">{title}</h5>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{desc}</p>
            <span className="text-[10px] font-bold text-slate-300 uppercase">{time}</span>
        </div>
    </div>
);