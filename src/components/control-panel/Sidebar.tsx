"use client"

import React, { ReactNode, useState } from 'react';
import {
  LayoutGrid, GraduationCap, Users, UserCircle,
  Library, Hourglass, BookOpen, Calendar,
  Settings, LogOut, Search, ChevronRight,
  Menu, HelpCircle, User, SwitchCamera,
  ChartSpline,
  Briefcase,
  ChevronsRight,
  PersonStanding,
  Zap,
  ArrowDownLeft,
  CreditCard
} from 'lucide-react';
import { cn } from "@/lib/utils"; // Standard Shadcn utility
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/vercel.svg';
import { string } from 'zod';
import NavItem from './NavItem';
// import { signOut } from 'next-auth/react';
// import Logout from './Logout';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* --- MOBILE VIEW: HAMBURGER TRIGGER --- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-md rounded-xl">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-white border-none">
            <SidebarContent isCollapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* --- DESKTOP VIEW: COLLAPSIBLE SIDEBAR --- */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white sticky top-0 h-screen transition-all duration-300 border-r border-slate-100 shadow-xl",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>
    </>
  );
}

// --- CORE SIDEBAR CONTENT ---
const SidebarContent = ({ isCollapsed, toggleCollapse }: { isCollapsed: boolean, toggleCollapse?: () => void }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">

      {/* Header / Brand Area */}
      <div className={cn(
        "p-6 flex items-center justify-between mb-2",
        isCollapsed ? "justify-center" : ""
      )}>
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl shadow-lg shadow-blue-200 shrink-0">
            <Image src={logo} alt="Nexshop Logo" width={24} height={24} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-800">NEXSHOP</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Brand Header 🚀</span>
            </div>
          )}
        </div>
        {!isCollapsed && toggleCollapse && (
          <button onClick={toggleCollapse} className="text-slate-400 hover:text-slate-800 transition-colors">
            <ChevronRight size={18} className="rotate-180" />
          </button>
        )}
        {isCollapsed && toggleCollapse && (
          <button onClick={toggleCollapse} className="absolute -right-3 top-12 bg-white border border-slate-100 rounded-full p-1 shadow-md z-50">
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Search Area */}
      {/* <div className={cn("px-6 mb-6", isCollapsed ? "flex justify-center" : "")}>
        {isCollapsed ? (
          <Button variant="ghost" size="icon" className="bg-slate-50 rounded-xl h-10 w-10">
            <Search size={18} className="text-slate-400" />
          </Button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Search..." className="h-11 pl-10 rounded-xl bg-slate-50 border-none focus-visible:ring-blue-600/20" />
          </div>
        )}
      </div> */}

      {/* Nav Items */}
      <div className={cn(
        "grow overflow-y-auto space-y-1 px-4",
        "scrollbar-none hover:scrollbar-thin hover:[scrollbar-color:#cbd5e1_transparent]",
        "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      )}>
        {/* Single Link (No Submenu) */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<ChartSpline size={20} />}
          label="Overview"
          active
          href="/control-panel/"
        />

        {/* Trigger (Has Submenu) */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<Briefcase size={20} />}
          label="Pages"
          subItems={[
            { label: "Home", href: "/control-panel/pages/home" },           
          ]}
        />

        {/* <Logout
          isCollapsed={isCollapsed}
          icon={<LogOut size={20} />}
          label="Log Out"
        /> */}
      </div>


      {/* Footer Area */}
      <div className="p-4 border-t border-slate-50 space-y-4">
        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl bg-slate-50/50",
          isCollapsed ? "justify-center" : ""
        )}>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>BJ</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="text-sm font-bold text-slate-800 truncate">Bonyra Jony</span>
              <span className="text-[10px] font-medium text-slate-400 truncate">bonyrajony125@gmail.com</span>
            </div>
          )}
        </div>

        {/* Drag Mode Toggle */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500">Drag Mode</span>
            <Switch className="data-[state=checked]:bg-blue-600 scale-90" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- NAVIGATION ITEM COMPONENT ---
// function NavItem({ icon, label, isCollapsed, active = false, hasSubmenu = false }: any) {
//   return (
//     <div className={cn(
//       "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group",
//       active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50",
//       isCollapsed ? "justify-center" : ""
//     )}>
//       <div className="flex items-center gap-4 overflow-hidden">
//         <span className={cn("shrink-0 transition-colors", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")}>
//           {icon}
//         </span>
//         {!isCollapsed && (
//           <span className={cn("text-sm font-bold whitespace-nowrap", active ? "text-blue-600" : "text-slate-500 group-hover:text-slate-800")}>
//             {label}
//           </span>
//         )}
//       </div>
//       {!isCollapsed && hasSubmenu && (
//         <ChevronRight size={14} className="text-slate-300" />
//       )}
//     </div>
//   );
// }

// --- NAVIGATION ITEM COMPONENT WITH SUB-MENU ---
// --- NAVIGATION ITEM COMPONENT WITH CONDITIONAL LINKING ---

