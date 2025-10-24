"use server";

import {
  ActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { mockPrisma as prisma } from "../mock-prisma";

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
