import { accountProfilePath, homePath, ticketsPath } from "@/paths";
import { LucideBook, LucideCircleUser, LucideTicket } from "lucide-react";
import { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    title: "All Tickets",
    icon: <LucideTicket />,
    href: homePath(),
  },
  {
    title: "My tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
  {
    separator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
  },
];

export const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
