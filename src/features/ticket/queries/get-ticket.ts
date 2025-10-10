import { prisma } from "@/lib/prisma";

const getTicket = async function getTicket(id: string) {
  console.log("ticket")
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

export { getTicket };
