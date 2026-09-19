"use client"

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from './SidebarContent';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      {/* --- MOBILE VIEW: HAMBURGER TRIGGER --- */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="bg-white shadow-md rounded-xl">
                <Menu size={20} />
              </Button>
            }
          />
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