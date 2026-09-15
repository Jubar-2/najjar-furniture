"use client"

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import logo from '../../../public/vercel.svg';
import { ChevronRight, ChartSpline, Briefcase, MessagesSquare, FolderOpen, Globe } from 'lucide-react';
import NavItem from './NavItem';

export const SidebarContent = ({ isCollapsed, toggleCollapse }: { isCollapsed: boolean, toggleCollapse?: () => void }) => {
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
            { label: "About Us", href: "/control-panel/pages/about-us" },
            { label: "Privacy Policy", href: "/control-panel/pages/privacy-policy" },
            { label: "Contact Us", href: "/control-panel/pages/contact-us" },
          ]}
        />

        <NavItem
          isCollapsed={isCollapsed}
          icon={<FolderOpen size={20} />}
          label="Portfolio"
          href="/control-panel/portfolio"
        />

        <NavItem
          isCollapsed={isCollapsed}
          icon={<MessagesSquare size={20} />}
          label="Testimonials"
          href="/control-panel/testimonials"
        />

        <NavItem
          isCollapsed={isCollapsed}
          icon={<Globe size={20} />}
          label="Meta & SEO"
          href="/control-panel/meta"
        />
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