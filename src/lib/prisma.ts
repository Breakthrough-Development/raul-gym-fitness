import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

// Prevent hot realoding from creating new instance of Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
