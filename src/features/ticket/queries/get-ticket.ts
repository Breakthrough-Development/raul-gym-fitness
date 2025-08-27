import { prisma } from "@/lib/prisma";

export async function getTicket(id: string) {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}
