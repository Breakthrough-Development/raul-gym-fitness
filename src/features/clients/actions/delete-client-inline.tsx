"use server";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/paths";
import { revalidatePath } from "next/cache";

export const deleteClientInline = async (id: string) => {
  await getAuthOrRedirect();

  try {
    await prisma.cliente.delete({
      where: { id },
    });

    revalidatePath(dashboardPath());

    return {
      status: "SUCCESS" as const,
      message: "Cliente eliminado",
      data: { id },
    };
  } catch (error) {
    return {
      status: "ERROR" as const,
      message: "Error al eliminar cliente",
      data: null,
    };
  }
};
