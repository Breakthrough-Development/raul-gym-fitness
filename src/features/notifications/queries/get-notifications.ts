import { prisma } from "@/lib/prisma";
import { NotificationSearchParams } from "../search-params";
import { NotificationWithClients } from "../types";

export async function getNotifications(
  searchParams: NotificationSearchParams
): Promise<{
  notifications: NotificationWithClients[];
  totalCount: number;
  totalPages: number;
}> {
  const { page, search, status, sort, order } = searchParams;
  const limit = 10;
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
