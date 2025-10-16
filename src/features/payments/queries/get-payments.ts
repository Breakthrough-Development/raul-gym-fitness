import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ParsedSearchParams } from "@/features/ticket/search-params";
import { prisma } from "@/lib/prisma";

export const getPayments = async (searchParams: ParsedSearchParams) => {
  await getAuthOrRedirect();

  const searchTerms = searchParams.search.trim().split(/\s+/);
  const where =
    searchTerms.length === 1
      ? {
          OR: [
            {
              client: {
                firstName: {
                  contains: searchTerms[0],
                  mode: "insensitive" as const,
                },
              },
            },
            {
              client: {
                lastName: {
                  contains: searchTerms[0],
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {
          AND: [
            {
              client: {
                firstName: {
                  contains: searchTerms[0],
                  mode: "insensitive" as const,
                },
              },
            },
            {
              client: {
                lastName: {
                  contains: searchTerms[1],
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        };
  const skip = searchParams.size * searchParams.page;
  const take = searchParams.size;

  const [payments, count] = await prisma.$transaction([
    prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: {
        [searchParams.sortKey]: searchParams.sortValue,
      },
      include: {
        client: true,
      },
    }),
    prisma.payment.count({
      where,
    }),
  ]);

  return {
    list: payments,
    metadata: {
      count,
      hasNextPage: count > skip + take,
    },
  };
};
