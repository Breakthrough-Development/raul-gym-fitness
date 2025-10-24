import { prisma } from "@/lib/prisma";
import { NotificationWithClients } from "../types";

export async function getNotification(
  id: string
): Promise<NotificationWithClients | null> {
  const notification = await prisma.scheduledNotification.findUnique({
    where: { id },
  });

  if (!notification) {
    return null;
  }

  // If there are selected client IDs, fetch the client details
  let clients;
  if (notification.selectedClientIds.length > 0) {
    clients = await prisma.cliente.findMany({
      where: {
        id: { in: notification.selectedClientIds },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
      },
    });
  }

  return {
    ...notification,
    clients,
  } as NotificationWithClients;
}
