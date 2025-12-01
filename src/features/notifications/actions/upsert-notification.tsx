"use server";

import type { ActionState } from "@/types/action-state";
import { toActionState } from "@/components/form/util/to-action-state";
import { prisma } from "@/lib/prisma";
import { notificationsPath } from "@/paths";
import { MembershipFilter, RecipientType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const upsertNotificationSchema = z.object({
  message: z.string().min(1, { message: "El mensaje es requerido" }),
  recipientType: z.enum(["ALL", "SELECTED"]),
  selectedClientIds: z.array(z.string()).default([]),
  membershipFilter: z.enum(["DAILY", "MONTHLY", "BOTH"]).optional(),
  sendDate: z.string().min(1, { message: "La fecha de envío es requerida" }).transform((str) => new Date(str)),
  recurrence: z.enum(["ONE_TIME", "WEEKLY", "MONTHLY"]),
  templateName: z.string().min(1, { message: "El nombre de la plantilla es requerido" }),
});

export async function upsertNotification(
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = upsertNotificationSchema.parse({
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
    
    const data = {
      ...parsed,
      recipientType: parsed.recipientType as RecipientType,
      recurrence: parsed.recurrence as "ONE_TIME" | "WEEKLY" | "MONTHLY",
      membershipFilter: parsed.membershipFilter as MembershipFilter | undefined,
    };

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
      id ? "Notificación actualizada" : "Notificación creada"
    );
  } catch (error) {
    console.error("Error upserting notification:", error);
    return toActionState(
      "ERROR",
      error instanceof Error ? error.message : "Ocurrió un error desconocido"
    );
  }
}
