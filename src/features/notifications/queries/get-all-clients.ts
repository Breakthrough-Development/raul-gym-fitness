"use server";

import { prisma } from "@/lib/prisma";

export async function getAllClients() {
  return await prisma.cliente.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      telefono: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
}
