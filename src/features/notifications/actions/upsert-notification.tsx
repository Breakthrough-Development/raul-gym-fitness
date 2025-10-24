"use server";

import { prisma } from "@/lib/prisma";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { CreateNotificationData, UpdateNotificationData } from "../types";

export async function upsertNotification(
  data: CreateNotificationData | UpdateNotificationData
) {
  try {
    const notificationData = {
      message: data.message,
      recipientType: data.recipientType,
      selectedClientIds: data.selectedClientIds,
      membershipFilter: data.membershipFilter,
      sendDate: data.sendDate,
      recurrence: data.recurrence,
      templateName: data.templateName,
    };

    let notification;
    if ("id" in data && data.id) {
      // Update existing notification
      notification = await prisma.scheduledNotification.update({
        where: { id: data.id },
        data: notificationData,
      });
    } else {
      // Create new notification
      notification = await prisma.scheduledNotification.create({
        data: notificationData,
      });
    }

    revalidatePath(notificationsPath());
    return { success: true, notification };
  } catch (error) {
    console.error("Error upserting notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
