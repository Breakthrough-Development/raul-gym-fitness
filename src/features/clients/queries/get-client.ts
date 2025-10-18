import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";

export const getClient = async (id: string) => {
  await getAuthOrRedirect();

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      Payment: true,
    },
  });

  return client;
};
