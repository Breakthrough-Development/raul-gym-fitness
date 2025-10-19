import { Prisma } from "@prisma/client";

export type PaymentWithMetadata = Prisma.PagoGetPayload<{
  include: { cliente: true };
}>;
