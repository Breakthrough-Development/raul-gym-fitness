"use client";
import { AccountDropdown } from "@/components/account-dropdown";
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
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./types";

type SidebarProps = {
  navItems: NavItem[];
};

export const Sidebar = ({ navItems }: SidebarProps) => {
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
                  <SidebarMenuButton
                    asChild
                    isActive={activeIndex === index}
                    tooltip={item.title}
                  >
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
          <AccountDropdown
            user={user}
            showName
            trigger={
              <SidebarMenuButton tooltip="Cuenta">
                <Settings />
                <span>Perfil</span>
              </SidebarMenuButton>
            }
          />
        </SidebarFooter>
      </SidebarContent>
    </SidebarUI>
  );
};
