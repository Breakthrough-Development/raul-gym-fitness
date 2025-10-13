import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";
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
  
  // Create only the first 2 users as User records (admin and royeradames)
  const adminUsers = users.slice(0, 2);
  const dbUsers = await prisma.user.createManyAndReturn({
    data: adminUsers.map((user) => ({
      ...user,
      password: passwordHash,
    })),
  });

  // Create the rest as Client records
  const clientUsers = users.slice(2);
  const dbClients = await prisma.client.createManyAndReturn({
    data: clientUsers.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    })),
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
  console.log(`Created ${dbUsers.length} users and ${dbClients.length} clients`);
};

seed();
