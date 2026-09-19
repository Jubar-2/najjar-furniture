"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronRight,
  LayoutDashboard,
  PanelsTopLeft,
  Armchair,
  MessageSquareQuote,
  SearchCheck,
  Inbox,
  LogOut,
} from "lucide-react";
import NavItem from "./NavItem";
import { useSession, signOut } from "next-auth/react";

export const SidebarContent = ({
  isCollapsed,
  toggleCollapse,
}: {
  isCollapsed: boolean;
  toggleCollapse?: () => void;
}) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans">
      {/* Header / Brand Area */}
      <div
        className={cn(
          "p-5 flex items-center justify-between border-b border-slate-100/60 mb-2",
          isCollapsed ? "justify-center px-2" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 text-white p-2.5 rounded-2xl shadow-md shadow-amber-200/50 shrink-0 flex items-center justify-center">
            <Armchair size={20} className="stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
                Najjar Studio
              </span>
              <span className="text-[10px] font-semibold text-amber-700/80 uppercase tracking-wider">
                Crafted Living
              </span>
            </div>
          )}
        </div>
        {!isCollapsed && toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-lg hover:bg-slate-100"
            title="Collapse sidebar"
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
        )}
        {isCollapsed && toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 shadow-md z-50 text-slate-600 hover:text-slate-900"
            title="Expand sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div
        className={cn(
          "grow overflow-y-auto space-y-1.5 px-3",
          "scrollbar-none hover:scrollbar-thin hover:[scrollbar-color:#cbd5e1_transparent]",
          "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full"
        )}
      >
        {/* Overview */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          href="/control-panel"
        />

        {/* Inquiries & Messages shortcut */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<Inbox size={20} />}
          label="Inquiries"
          href="/control-panel/pages/contact-us"
        />

        {/* Pages with Submenu */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<PanelsTopLeft size={20} />}
          label="Pages"
          subItems={[
            { label: "Home", href: "/control-panel/pages/home" },
            { label: "About Us", href: "/control-panel/pages/about-us" },
            { label: "Portfolio", href: "/control-panel/portfolio" },
            { label: "Contact Us", href: "/control-panel/pages/contact-us" },
            { label: "Privacy Policy", href: "/control-panel/pages/privacy-policy" },
            { label: "Terms & Conditions", href: "/control-panel/pages/terms-conditions" },
          ]}
        />

        {/* Portfolio Collections */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<Armchair size={20} />}
          label="Portfolio"
          href="/control-panel/portfolio"
        />

        {/* Testimonials */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<MessageSquareQuote size={20} />}
          label="Testimonials"
          href="/control-panel/testimonials"
        />

        {/* SEO & Meta */}
        <NavItem
          isCollapsed={isCollapsed}
          icon={<SearchCheck size={20} />}
          label="Meta & SEO"
          href="/control-panel/meta"
        />
      </div>

      {/* Footer Area: User Profile & Sign Out */}
      <div className="p-3 border-t border-slate-100 space-y-2.5 bg-white">
        {/* User Profile Info */}
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl bg-slate-50/80 border border-slate-100",
            isCollapsed ? "justify-center p-1.5" : ""
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-white shadow-2xs shrink-0">
            <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xs">
              {session?.user?.email
                ? session.user.email.slice(0, 2).toUpperCase()
                : "AD"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">
                {session?.user?.email
                  ? session.user.email.split("@")[0]
                  : "Administrator"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {session?.user?.email || "admin@najjarfurniture.com"}
              </span>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {isCollapsed ? (
          <button
            type="button"
            title="Sign Out"
            onClick={() => signOut({ callbackUrl: "/control-panel/auth" })}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-100 cursor-pointer"
          >
            <LogOut size={17} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/control-panel/auth" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100/90 text-red-600 font-semibold text-xs transition-all border border-red-100 shadow-2xs cursor-pointer group"
          >
            <LogOut
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};