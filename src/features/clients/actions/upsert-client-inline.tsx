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
    const nombre = formData.get("nombre") as string | null;
    const apellido = formData.get("apellido") as string | null;
    const email = formData.get("email") as string | null;
    const telefono = normalizeToE164(formData.get("telefono") as string | null);

    const data = upsertClientSchema.parse({
      nombre,
      apellido,
      email,
      telefono,
    });

    const client = await prisma.cliente.upsert({
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
  } catch (error) {
    return {
      status: "ERROR" as const,
      message: "Error al guardar cliente",
      data: null,
    };
  }
};
