"use server";

import { prisma } from "@/lib/prisma";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";

export async function deleteNotification(id: string) {
  try {
    await prisma.scheduledNotification.delete({
      where: { id },
    });

    revalidatePath(notificationsPath());
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
