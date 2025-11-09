// @ts-nocheck
import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";
import { clients } from "./data/clients";
import { payments } from "./data/payments";
import { users } from "./data/users";
const prisma = new PrismaClient();

const seed = async () => {
  const t0 = performance.now();
  console.log("DB seed: Started ...");

  await prisma.payment.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash(process.env.SEED_PASSWORD || "gemeimnis");
  const adminPasswordHash = await hash("gemeimnis"); // Hardcoded for admin user

  // Create users (admin and royeradames)
  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      password: user.username === "admin" ? adminPasswordHash : passwordHash,
    })),
  });

  // Create clients from the clients data file
  const dbClients = await prisma.client.createManyAndReturn({
    data: clients,
  });

  // Distribute payments evenly among clients (3 payments per client)
  const paymentsWithClients = [];

  // Ensure each client gets exactly 3 payments
  for (let i = 0; i < dbClients.length; i++) {
    for (let j = 0; j < 3; j++) {
      const paymentIndex = i * 3 + j;
      if (paymentIndex < payments.length) {
        paymentsWithClients.push({
          ...payments[paymentIndex],
          clientId: dbClients[i].id,
        });
      }
    }
  }

  await prisma.payment.createManyAndReturn({
    data: paymentsWithClients,
  });

  const t1 = performance.now();
  console.log(`DB seed: Completed in ${t1 - t0}ms`);
  console.log(
    `Created ${dbUsers.length} users and ${dbClients.length} clients`
  );
};

seed();
