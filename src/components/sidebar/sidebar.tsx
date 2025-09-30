"use client";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarUI,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { signInPath, signUpPath } from "@/paths";
import { getActivePath } from "@/utils/get-active-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountDropdown } from "../account-dropdown";
import { navItems } from "./constants";

export const Sidebar = () => {
  const { user, isFetched } = useAuth();
  const pathname = usePathname();
  const { activeIndex } = getActivePath(
    pathname,
    navItems.map((navItem) => navItem.href),
    [signInPath(), signUpPath()]
  );

  if (!user || !isFetched) {
    return <div className="h-screen w-[78px] absolute" />;
  }

  return (
    <SidebarUI collapsible="icon" className="animate-sidebar-from-left">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activeIndex === index}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenuButton asChild>
            <AccountDropdown user={user} showName />
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
    </SidebarUI>
  );
};
