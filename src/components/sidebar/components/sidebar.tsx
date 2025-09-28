"use client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { signInPath, signUpPath } from "@/paths";
import { getActivePath } from "@/utils/get-active-path";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "../constants";
import { SidebarItem } from "./sidebar-item";

const Sidebar = () => {
  const { user, isFetched } = useAuth();
  const [isTransition, setTransition] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const { activeIndex } = getActivePath(
    pathname,
    navItems.map((navItem) => navItem.href),
    [signInPath(), signUpPath()]
  );

  const handleToggle = (open: boolean) => {
    setTransition(true);
    setOpen(open);
    setTimeout(() => {
      setTransition(false);
    }, 200);
  };

  if (!user || !isFetched) {
    return <div className="h-screen w-[78px] absolute" />;
  }

  return (
    <nav
      className={cn(
        "animate-sidebar-from-left absolute peer",
        "h-screen border-r pt-24",
        isTransition && "duration-200",
        isOpen ? "md:w-60 w-[78px]" : "w-[78px]"
      )}
      onMouseEnter={() => handleToggle(true)}
      onMouseLeave={() => handleToggle(false)}
    >
      <div className="px-3 py-2">
        <nav className="space-y-2">
          {navItems.map((navItem, index) => (
            <SidebarItem
              key={navItem.title}
              isOpen={isOpen}
              navItem={navItem}
              isActive={activeIndex === index}
            />
          ))}
        </nav>
      </div>
    </nav>
  );
};

export { Sidebar };
