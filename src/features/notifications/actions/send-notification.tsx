"use server";

import type { ActionState } from "@/types/action-state";
import { toActionState } from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";

export async function sendNotification(id: string): Promise<ActionState> {
  try {
    const notification = await prisma.scheduledNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      return toActionState("ERROR", "Notification not found");
    }

    if (notification.status !== "PENDING") {
      return toActionState("ERROR", "Notification is not in pending status");
    }

    // Get clients to send to
    let clients;
    if (notification.recipientType === "ALL") {
      // Get all clients with phone numbers
      clients = await prisma.client.findMany({
        where: {
          phone: { not: null },
          ...(notification.membershipFilter && {
            payments: {
              some: {
                membership:
                  notification.membershipFilter === "BOTH"
                    ? { in: ["DAILY", "MONTHLY"] }
                    : notification.membershipFilter,
                status: "PAID",
              },
            },
          }),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      });
    } else {
      // Get selected clients
      clients = await prisma.client.findMany({
        where: {
          id: { in: notification.selectedClientIds },
          phone: { not: null },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Send messages to each client
    for (const client of clients) {
      if (!client.phone) continue;

      // Prepare template variables (using client name as example)
      const variables = [client.firstName];

      const result = await sendWhatsAppTemplate(
        client.phone,
        notification.templateName,
        variables
      );

      if (result.ok) {
        sentCount++;
      } else {
        failedCount++;
        errors.push(`${client.firstName}: ${result.error}`);
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
    return toActionState(
      "SUCCESS",
      `Sent to ${sentCount} clients${
        failedCount > 0 ? `, ${failedCount} failed` : ""
      }`
    );
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
    return toActionState(
      "ERROR",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
