import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ClientParsedSearchParams } from "@/features/clients/client-search-params";
import { prisma } from "@/lib/prisma";

export const getClients = async (searchParams: ClientParsedSearchParams) => {
  await getAuthOrRedirect();

  const searchTerms = searchParams.search.trim().split(/\s+/);
  const where =
    searchTerms.length === 1
      ? {
          OR: [
            {
              firstName: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
            {
              lastName: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {
          AND: [
            {
              firstName: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
            {
              lastName: {
                contains: searchTerms[1],
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
