import { Prisma } from "@prisma/client";

export type ClientWithMetadata = Prisma.ClientGetPayload<{
  include: { payments: true };
}>;
