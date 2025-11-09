"use server";

import { prisma } from "@/lib/prisma";

export async function getAllClients() {
  return await prisma.client.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });
}
