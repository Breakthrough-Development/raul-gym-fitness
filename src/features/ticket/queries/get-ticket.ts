import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

const getTicket = async function getTicket(id: string) {
  const { user } = await getAuth();
  const ticket = await prisma.ticket.findUnique({
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
  if (!ticket) {
    return null;
  }
  return { ...ticket, isOwner: isOwner(user, ticket) };
};

export { getTicket };
