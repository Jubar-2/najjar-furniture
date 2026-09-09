import { ChevronRight, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import React from "react";

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

function NavItem({ icon, label, isCollapsed, active = false, subItems = [], href = "#" }: NavItemType) {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubmenu = subItems.length > 0;

    // Close sub-menus when sidebar collapses
    React.useEffect(() => {
        if (isCollapsed) setIsOpen(false);
    }, [isCollapsed]);

    const handleToggle = () => {
        if (!isCollapsed && hasSubmenu) {
            setIsOpen(!isOpen);
        }
    };

    // Reusable UI for the row content to avoid duplication
    const ItemContent = (
        <div
            className={cn(
                "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group",
                active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50",
                isCollapsed ? "justify-center" : ""
            )}
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <span className={cn("shrink-0 transition-colors", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")}>
                    {icon}
                </span>
                {!isCollapsed && (
                    <span className={cn("text-sm font-bold whitespace-nowrap", active ? "text-blue-600" : "text-slate-500 group-hover:text-slate-800")}>
                        {label}
                    </span>
                )}
            </div>

            {!isCollapsed && hasSubmenu && (
                <ChevronRight
                    size={14}
                    className={cn("text-slate-300 transition-transform duration-200", isOpen ? "rotate-90" : "")}
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
                    <div className="overflow-hidden flex flex-col gap-1 pl-1 border-l border-slate-100 ml-6">
                        {subItems.map((item: subItemType, idx: number) => (
                            <Link
                                key={idx}
                                href={item.href || "#"}
                                className="p-2 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1"
                            >
                                <ChevronsRight size={14} />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavItem