import { env } from "@/env";

export const featureFlags = {
  whatsappNotifications: env.FEATURE_WHATSAPP_NOTIFICATIONS,
  scheduledNotifications: env.FEATURE_SCHEDULED_NOTIFICATIONS,
  paymentManagement: env.FEATURE_PAYMENT_MANAGEMENT,
  userManagement: env.FEATURE_USER_MANAGEMENT,
  clientManagement: env.FEATURE_CLIENT_MANAGEMENT,
  dashboardCharts: env.FEATURE_DASHBOARD_CHARTS,
  passwordReset: env.FEATURE_PASSWORD_RESET,
} as const;

export function isFeatureEnabled(
  feature: keyof typeof featureFlags
): boolean {
  return featureFlags[feature];
}

