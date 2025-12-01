"use server";

import { prisma } from "@/lib/prisma";
import { ScheduledNotificationStatus } from "@prisma/client";
import {
  NOTIFICATION_PAGINATION_PAGE_DEFAULT,
  NOTIFICATION_PAGINATION_SIZE_DEFAULT,
  notificationPageKey,
  notificationSearchKey,
  NotificationSearchParams,
} from "../search-params";
import { NotificationWithClients } from "../types";

export async function getNotifications(
  searchParams: NotificationSearchParams
): Promise<{
  notifications: NotificationWithClients[];
  totalCount: number;
  totalPages: number;
}> {
  // Support both legacy (page, search) and nuqs (notificationPage, notificationSearch) keys
  const params = searchParams as Record<string, unknown>;

  const page =
    (params[notificationPageKey] as number) ??
    (params["page"] as number) ??
    NOTIFICATION_PAGINATION_PAGE_DEFAULT;

  const search =
    (params[notificationSearchKey] as string) ??
    (params["search"] as string) ??
    "";

  const status = params["status"] as ScheduledNotificationStatus | undefined;
  const sort = (params["sort"] as string) ?? "createdAt";
  const order = (params["order"] as "asc" | "desc") ?? "desc";

  const limit = NOTIFICATION_PAGINATION_SIZE_DEFAULT;
  const offset = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { message: { contains: search, mode: "insensitive" as const } },
        { templateName: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status && { status }),
  };

  const [notifications, totalCount] = await Promise.all([
    prisma.scheduledNotification.findMany({
      where,
      orderBy: { [sort]: order },
      skip: offset,
      take: limit,
    }),
    prisma.scheduledNotification.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    notifications: notifications as NotificationWithClients[],
    totalCount,
    totalPages,
  };
}
