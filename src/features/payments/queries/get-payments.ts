import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import {
  ParsedPaymentSearchParams,
  paymentPageKey,
  paymentSearchKey,
  paymentSizeKey,
} from "@/features/payments/search-params";
import { prisma } from "@/lib/prisma";

export const getPayments = async (searchParams: ParsedPaymentSearchParams) => {
  await getAuthOrRedirect();

  const searchTerms = (searchParams[paymentSearchKey] ?? "")
    .trim()
    .split(/\s+/);
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
  const page = searchParams[paymentPageKey] ?? 0;
  const size = searchParams[paymentSizeKey] ?? 10;
  const skip = size * page;
  const take = size;

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
