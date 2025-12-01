"use server";

import type { ActionState } from "@/types/action-state";
import { toActionState } from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";

export async function deleteNotification(id: string): Promise<ActionState> {
  try {
    await prisma.scheduledNotification.delete({
      where: { id },
    });

    revalidatePath(notificationsPath());
    return toActionState("SUCCESS", "Notification deleted");
  } catch (error) {
    console.error("Error deleting notification:", error);
    return toActionState(
      "ERROR",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
