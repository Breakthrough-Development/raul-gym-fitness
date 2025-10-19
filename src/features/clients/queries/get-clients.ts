import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import {
  ClientParsedSearchParams,
  clientPageKey,
  clientSearchKey,
  clientSizeKey,
} from "@/features/clients/client-search-params";
import { prisma } from "@/lib/prisma";

export const getClients = async (searchParams: ClientParsedSearchParams) => {
  await getAuthOrRedirect();

  const searchTerms = (searchParams[clientSearchKey] ?? "").trim().split(/\s+/);
  const where =
    searchTerms.length === 1
      ? {
          OR: [
            {
              nombre: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
            {
              apellido: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {
          AND: [
            {
              nombre: {
                contains: searchTerms[0],
                mode: "insensitive" as const,
              },
            },
            {
              apellido: {
                contains: searchTerms[1],
                mode: "insensitive" as const,
              },
            },
          ],
        };
  const page = searchParams[clientPageKey] ?? 0;
  const size = searchParams[clientSizeKey] ?? 10;
  const skip = size * page;
  const take = size;

  const [clients, count] = await prisma.$transaction([
    prisma.cliente.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        Pago: true,
      },
    }),
    prisma.cliente.count({
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
