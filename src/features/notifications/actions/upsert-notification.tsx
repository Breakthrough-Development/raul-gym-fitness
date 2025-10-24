"use server";

import {
  ActionState,
  toActionState,
} from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { notificationsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const upsertNotificationSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipientType: z.enum(["ALL", "SELECTED"]),
  selectedClientIds: z.array(z.string()).default([]),
  membershipFilter: z.enum(["DIARIO", "MENSUAL", "BOTH"]).optional(),
  sendDate: z.string().transform((str) => new Date(str)),
  recurrence: z.enum(["ONE_TIME", "WEEKLY", "MONTHLY"]),
  templateName: z.string().min(1, "Template name is required"),
});

export async function upsertNotification(
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = upsertNotificationSchema.parse({
      message: formData.get("message"),
      recipientType: formData.get("recipientType"),
      selectedClientIds: JSON.parse(
        (formData.get("selectedClientIds") as string) || "[]"
      ),
      membershipFilter: (() => {
        const value = formData.get("membershipFilter");
        return value === "all" ? undefined : value || undefined;
      })(),
      sendDate: formData.get("sendDate"),
      recurrence: formData.get("recurrence"),
      templateName: formData.get("templateName"),
    });

    if (id) {
      // Update existing notification
      await prisma.scheduledNotification.update({
        where: { id },
        data,
      });
    } else {
      // Create new notification
      await prisma.scheduledNotification.create({
        data,
      });
    }

    revalidatePath(notificationsPath());
    return toActionState(
      "SUCCESS",
      id ? "Notification updated" : "Notification created"
    );
  } catch (error) {
    console.error("Error upserting notification:", error);
    return toActionState(
      "ERROR",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
