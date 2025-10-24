import {
  accountProfilePath,
  homePath,
  notificationsPath,
  paymentsPath,
  usersPath,
} from "@/paths";
import {
  LucideCircleUser,
  LucideHome,
  LucideMessageSquare,
  LucideReceipt,
  LucideUsers,
} from "lucide-react";
import { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    icon: <LucideHome />,
    href: homePath(),
  },
  {
    title: "Pagos",
    icon: <LucideReceipt />,
    href: paymentsPath(),
  },
  {
    title: "Usuarios",
    icon: <LucideUsers />,
    href: usersPath(),
  },
  {
    title: "WhatsApp Notifications",
    icon: <LucideMessageSquare />,
    href: notificationsPath(),
  },
  {
    separator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
  },
];
