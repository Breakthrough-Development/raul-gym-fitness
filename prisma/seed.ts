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

  await prisma.pago.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  const passwordHash = await hash(process.env.SEED_PASSWORD || "gemeimnis");
  const adminPasswordHash = await hash("gemeimnis"); // Hardcoded for admin user

  // Create users (admin and royeradames)
  const dbUsers = await prisma.usuario.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      password: user.usuario === "admin" ? adminPasswordHash : passwordHash,
    })),
  });

  // Create clients from the clients data file
  const dbClients = await prisma.cliente.createManyAndReturn({
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
          clienteId: dbClients[i].id,
        });
      }
    }
  }

  await prisma.pago.createManyAndReturn({
    data: paymentsWithClients,
  });

  const t1 = performance.now();
  console.log(`DB seed: Completed in ${t1 - t0}ms`);
  console.log(
    `Created ${dbUsers.length} usuarios and ${dbClients.length} clientes`
  );
};

seed();
