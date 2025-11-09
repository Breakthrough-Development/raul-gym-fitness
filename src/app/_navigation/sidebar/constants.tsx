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

export function getNavItems(featureFlags: {
  paymentManagement: boolean;
  userManagement: boolean;
  whatsappNotifications: boolean;
  scheduledNotifications: boolean;
}): NavItem[] {
  return [
    {
      title: "Inicio",
      icon: <LucideHome />,
      href: homePath(),
    },
    ...(featureFlags.paymentManagement
      ? [
          {
            title: "Pagos",
            icon: <LucideReceipt />,
            href: paymentsPath(),
          },
        ]
      : []),
    ...(featureFlags.userManagement
      ? [
          {
            title: "Usuarios",
            icon: <LucideUsers />,
            href: usersPath(),
          },
        ]
      : []),
    ...(featureFlags.whatsappNotifications ||
    featureFlags.scheduledNotifications
      ? [
          {
            title: "WhatsApp Notifications",
            icon: <LucideMessageSquare />,
            href: notificationsPath(),
          },
        ]
      : []),
    {
      separator: true,
      title: "Account",
      icon: <LucideCircleUser />,
      href: accountProfilePath(),
    },
  ];
}
