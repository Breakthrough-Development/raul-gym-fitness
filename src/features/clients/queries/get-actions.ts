import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ParsedSearchParams } from "@/features/ticket/search-params";
import { prisma } from "@/lib/prisma";

export const getClients = async (searchParams: ParsedSearchParams) => {
  await getAuthOrRedirect();

  const where = {
    OR: [
      {
        firstName: {
          contains: searchParams.search,
          mode: "insensitive" as const,
        },
      },
      {
        lastName: {
          contains: searchParams.search,
          mode: "insensitive" as const,
        },
      },
    ],
  };
  const skip = searchParams.size * searchParams.page;
  const take = searchParams.size;

  const [clients, count] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        Payment: true,
      },
    }),
    prisma.client.count({
      where,
    }),
  ]);

  return {
    list: clients,
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
