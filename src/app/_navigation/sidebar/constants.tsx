import { accountProfilePath, homePath, paymentsPath, usersPath } from "@/paths";
import {
  LucideCircleUser,
  LucideHome,
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
    separator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
  },
];
