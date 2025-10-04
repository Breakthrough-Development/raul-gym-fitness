import { prisma } from "@/lib/prisma";
import { SORT } from "../constants";
import { ParsedSearchParams } from "../search-params";

export const getTickets = async (
  userId: string | undefined,
  searchParams: ParsedSearchParams
) => {
  return await prisma.ticket.findMany({
    where: {
      userId,
      title: {
        contains: searchParams.search,
        mode: "insensitive",
      },
      ...(searchParams.sort === SORT.STATUS_OPEN && {
        status: "OPEN",
      }),
      ...(searchParams.sort === SORT.STATUS_DONE && {
        status: "DONE",
      }),
      ...(searchParams.sort === SORT.STATUS_IN_PROGRESS && {
        status: "IN_PROGRESS",
      }),
    },
    orderBy: {
      ...(searchParams.sort === SORT.NEWEST && {
        deadline: "desc",
      }),
      ...(searchParams.sort === SORT.OLDEST && {
        deadline: "asc",
      }),
      ...(searchParams.sort === SORT.BOUNTY_ASC && {
        bounty: "asc",
      }),
      ...(searchParams.sort === SORT.BOUNTY_DESC && {
        bounty: "desc",
      }),
      ...(searchParams.sort === SORT.TITLE_ASC && {
        title: "asc",
      }),
      ...(searchParams.sort === SORT.TITLE_DESC && {
        title: "desc",
      }),
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
