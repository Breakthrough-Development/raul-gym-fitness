import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    firstName: "Admin",
    lastName: "Admin",
  },
  {
    username: "royeradames",
    email: "royeraadames@gmail.com",
    firstName: "Royer",
    lastName: "Adames",
  },
];
const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
  },
  {
    title: "Ticket 4",
    content: "This is the fourth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 299,
  },
  {
    title: "Ticket 5", 
    content: "This is the fifth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 699,
  },
  {
    title: "Ticket 6",
    content: "This is the sixth ticket", 
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 449,
  },
  {
    title: "Ticket 7",
    content: "This is the seventh ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 549,
  },
  {
    title: "Ticket 8",
    content: "This is the eighth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 9",
    content: "This is the ninth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 649,
  },
  {
    title: "Ticket 10",
    content: "This is the tenth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 11",
    content: "This is the eleventh ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 799,
  },
  {
    title: "Ticket 12",
    content: "This is the twelfth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 349,
  },
  {
    title: "Ticket 13",
    content: "This is the thirteenth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
  },
  {
    title: "Ticket 14",
    content: "This is the fourteenth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 449,
  },
  {
    title: "Ticket 15",
    content: "This is the fifteenth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 699,
  },
  {
    title: "Ticket 16",
    content: "This is the sixteenth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 549,
  },
  {
    title: "Ticket 17",
    content: "This is the seventeenth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 899,
  },
  {
    title: "Ticket 18",
    content: "This is the eighteenth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 19",
    content: "This is the nineteenth ticket",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 649,
  },
  {
    title: "Ticket 20",
    content: "This is the twentieth ticket",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("DB seed: Started ...");

  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();

  const passwordHash = await hash(process.env.SEED_PASSWORD || "gemeimnis");
  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      password: passwordHash,
    })),
  });
  await prisma.ticket.createMany({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
    })),
  });

  const t1 = performance.now();
  console.log(`DB seed: Completed in ${t1 - t0}ms`);
};

seed();
