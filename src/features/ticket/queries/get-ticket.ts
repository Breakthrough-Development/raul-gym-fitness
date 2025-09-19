import { prisma } from "@/lib/prisma";

const getTicket = async function getTicket(id: string) {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
};

export { getTicket };
