import { Prisma } from "@prisma/client";

export type ClientWithMetadata = Prisma.ClienteGetPayload<{
  include: { Pago: true };
}>;
