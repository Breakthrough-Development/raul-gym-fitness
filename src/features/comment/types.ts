import { Prisma } from "@prisma/client";

export type CommetWithMetaData = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        username: true;
      };
    };
  };
}>;
