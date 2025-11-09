"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { normalizeToE164, upsertClientSchema } from "./client-schema";

export const upsertClientInline = async (
  id: string | undefined,
  formData: FormData
) => {
  await getAuthOrRedirect();

  try {
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const phone = normalizeToE164(formData.get("phone") as string | null);

    const data = upsertClientSchema.parse({
      firstName,
      lastName,
      email,
      phone,
    });

    const client = await prisma.client.upsert({
      where: { id: id || "" },
      create: data,
      update: data,
    });

    revalidatePath(dashboardPath());

    return {
      status: "SUCCESS" as const,
      message: id ? "Cliente actualizado" : "Cliente creado",
      data: client,
    };
  } catch {
    return {
      status: "ERROR" as const,
      message: "Error al guardar cliente",
      data: null,
    };
  }
};
