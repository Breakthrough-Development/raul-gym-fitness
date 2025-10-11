"use server";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

export const getComments = async (
  ticketId: string,
  cursor?: { id: string; createdAt: number }
) => {
  const { user } = await getAuth();

  const where = {
    ticketId,
  };
  const take = 2;
  const overFetch = take + 1;

  const [comments, count] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      cursor: cursor
        ? { createdAt: new Date(cursor.createdAt), id: cursor.id }
        : undefined,
      skip: cursor ? 1 : 0,
      take: overFetch,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        { id: "desc" },
      ],
    }),
    prisma.comment.count({
      where,
    }),
  ]);

  const hasNextPage = comments.length > take;
  const finalComments = hasNextPage ? comments.slice(0, -1) : comments;
  const lastComment = comments.at(-1);

  const list = finalComments.map((comment) => ({
    ...comment,
    isOwner: isOwner(user, comment),
  }));
  return {
    list,
    metadata: {
      count,
      hasNextPage,
      cursor: lastComment
        ? { createdAt: lastComment.createdAt.valueOf(), id: lastComment.id }
        : undefined,
    },
  };
};
