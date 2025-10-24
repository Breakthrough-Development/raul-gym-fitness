// Temporary mock for Prisma client until migration is run
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockPrisma = {
  scheduledNotification: {
    findMany: async () => [],
    findUnique: async () => null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: async (data: any) => ({ id: "mock-id", ...data.data }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: async (data: any) => ({ id: data.where.id, ...data.data }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: async (data: any) => ({ id: data.where.id }),
    count: async () => 0,
  },
  cliente: {
    findMany: async () => [],
    findUnique: async () => null,
  },
};
