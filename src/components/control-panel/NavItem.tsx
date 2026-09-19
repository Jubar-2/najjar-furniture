"use client";

import { ChevronRight, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

type subItemType = {
    label: string,
    href: string
}

type NavItemType = {
    icon: ReactNode,
    label: string,
    isCollapsed: boolean,
    active?: boolean,
    subItems?: subItemType[],
    href?: string
}

const normalizePath = (path: string) => {
    if (!path) return "";
    const clean = path.replace(/\/+$/, "");
    return clean === "" ? "/" : clean;
};

const isRouteActive = (targetHref: string, currentPathname: string | null) => {
    if (!targetHref || targetHref === "#" || !currentPathname) return false;
    const current = normalizePath(currentPathname);
    const target = normalizePath(targetHref);

    if (target === "/control-panel") {
        return current === "/control-panel";
    }

    return current === target || current.startsWith(target + "/");
};

function NavItem({ icon, label, isCollapsed, active: explicitActive, subItems = [], href = "#" }: NavItemType) {
    const pathname = usePathname();
    const hasSubmenu = subItems.length > 0;

    const isSelfActive = isRouteActive(href, pathname);
    const hasActiveChild = hasSubmenu && subItems.some((item) => isRouteActive(item.href, pathname));
    const isActive = explicitActive !== undefined ? explicitActive : (hasSubmenu ? hasActiveChild : isSelfActive);

    const [isOpen, setIsOpen] = useState(hasActiveChild);

    // If pathname changes and an active child exists, expand submenu
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        if (hasActiveChild && !isCollapsed) {
            setIsOpen(true);
        }
    }

    // Close sub-menus when sidebar collapses, re-open if active child exists
    const [prevCollapsed, setPrevCollapsed] = useState(isCollapsed);
    if (prevCollapsed !== isCollapsed) {
        setPrevCollapsed(isCollapsed);
        if (isCollapsed) {
            setIsOpen(false);
        } else if (hasActiveChild) {
            setIsOpen(true);
        }
    }

    const handleToggle = () => {
        if (!isCollapsed && hasSubmenu) {
            setIsOpen(!isOpen);
        }
    };

    // Reusable UI for the row content to avoid duplication
    const ItemContent = (
        <div
            title={isCollapsed ? label : undefined}
            className={cn(
                "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group select-none",
                isActive
                    ? hasActiveChild && !isCollapsed
                        ? "bg-blue-50/50 text-blue-600 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                isCollapsed ? "justify-center" : ""
            )}
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <span className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}>
                    {icon}
                </span>
                {!isCollapsed && (
                    <span className={cn(
                        "text-sm whitespace-nowrap transition-colors",
                        isActive ? "text-blue-600 font-bold" : "text-slate-500 font-medium group-hover:text-slate-800"
                    )}>
                        {label}
                    </span>
                )}
            </div>

            {!isCollapsed && hasSubmenu && (
                <ChevronRight
                    size={14}
                    className={cn(
                        "text-slate-300 transition-transform duration-200",
                        isOpen ? "rotate-90 text-slate-500" : "",
                        hasActiveChild ? "text-blue-500" : ""
                    )}
                />
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            {/* 
         LOGIC: If it has a submenu, it's a <div> trigger. 
         If no submenu, it's a Next.js <Link>.
      */}
            {hasSubmenu ? (
                <div onClick={handleToggle}>{ItemContent}</div>
            ) : (
                <Link href={href}>{ItemContent}</Link>
            )}

            {/* Sub-menu Container */}
            {!isCollapsed && hasSubmenu && (
                <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0 mt-0"
                )}>
                    <div className="overflow-hidden flex flex-col gap-1 pl-1 border-l-2 border-slate-100 ml-6">
                        {subItems.map((item: subItemType, idx: number) => {
                            const isChildActive = isRouteActive(item.href, pathname);
                            return (
                                <Link
                                    key={idx}
                                    href={item.href || "#"}
                                    className={cn(
                                        "px-2.5 py-2 text-xs rounded-lg transition-all flex items-center justify-between group/sub",
                                        isChildActive
                                            ? "bg-blue-50 text-blue-600 font-bold shadow-xs"
                                            : "text-slate-400 hover:text-blue-600 hover:bg-blue-50/60 font-medium"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <ChevronsRight
                                            size={14}
                                            className={cn(
                                                "transition-colors shrink-0",
                                                isChildActive ? "text-blue-600" : "text-slate-300 group-hover/sub:text-blue-500"
                                            )}
                                        />
                                        <span className="truncate">{item.label}</span>
                                    </div>
                                    {isChildActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mr-1" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavItem;