import { Prisma } from "@prisma/client";

export type PaymentWithMetadata = Prisma.PaymentGetPayload<{
  include: { client: true };
}>;
