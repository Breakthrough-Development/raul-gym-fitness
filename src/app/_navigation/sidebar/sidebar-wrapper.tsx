import { featureFlags } from "@/lib/feature-flags";
import { getNavItems } from "./constants";
import { Sidebar } from "./sidebar";

export async function SidebarWrapper() {
  const navItems = getNavItems({
    paymentManagement: featureFlags.paymentManagement,
    userManagement: featureFlags.userManagement,
    whatsappNotifications: featureFlags.whatsappNotifications,
    scheduledNotifications: featureFlags.scheduledNotifications,
    clientManagement: featureFlags.clientManagement,
  });

  return <Sidebar navItems={navItems} />;
}
