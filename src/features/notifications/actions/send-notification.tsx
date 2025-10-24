"use server";

import { prisma } from "@/lib/prisma";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";

export async function sendNotification(id: string) {
  try {
    const notification = await prisma.scheduledNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.status !== "PENDING") {
      return { success: false, error: "Notification is not in pending status" };
    }

    // Get clients to send to
    let clients;
    if (notification.recipientType === "ALL") {
      // Get all clients with phone numbers
      clients = await prisma.cliente.findMany({
        where: {
          telefono: { not: null },
          ...(notification.membershipFilter && {
            Pago: {
              some: {
                membresia:
                  notification.membershipFilter === "BOTH"
                    ? { in: ["DIARIO", "MENSUAL"] }
                    : notification.membershipFilter,
                estado: "PAGADO",
              },
            },
          }),
        },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      });
    } else {
      // Get selected clients
      clients = await prisma.cliente.findMany({
        where: {
          id: { in: notification.selectedClientIds },
          telefono: { not: null },
        },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
        },
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send messages to each client
    for (const client of clients) {
      if (!client.telefono) continue;

      // Prepare template variables (using client name as example)
      const variables = [client.nombre];

      const result = await sendWhatsAppTemplate(
        client.telefono,
        notification.templateName,
        variables
      );

      if (result.ok) {
        sentCount++;
      } else {
        failedCount++;
        errors.push(`${client.nombre}: ${result.error}`);
      }
    }

    // Update notification status
    const status =
      failedCount === 0
        ? "SENT"
        : failedCount === sentCount
        ? "FAILED"
        : "SENT";
    const errorMessage = errors.length > 0 ? errors.join("; ") : null;

    await prisma.scheduledNotification.update({
      where: { id },
      data: {
        status,
        sentAt: new Date(),
        error: errorMessage,
      },
    });

    revalidatePath(notificationsPath());
    return {
      success: true,
      sentCount,
      failedCount,
      totalClients: clients.length,
    };
  } catch (error) {
    console.error("Error sending notification:", error);

    // Update notification status to failed
    await prisma.scheduledNotification.update({
      where: { id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    revalidatePath(notificationsPath());
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
