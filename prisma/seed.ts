import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";
import { payments } from "./data/payments";
import { users } from "./data/users";
const prisma = new PrismaClient();

const seed = async () => {
  const t0 = performance.now();
  console.log("DB seed: Started ...");

  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash(process.env.SEED_PASSWORD || "gemeimnis");
  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      password: passwordHash,
    })),
  });
  // Distribute payments evenly among all users (3 payments per user)
  const paymentsWithUsers = [];

  // Ensure each user gets exactly 3 payments
  for (let i = 0; i < dbUsers.length; i++) {
    for (let j = 0; j < 3; j++) {
      const paymentIndex = i * 3 + j;
      if (paymentIndex < payments.length) {
        paymentsWithUsers.push({
          ...payments[paymentIndex],
          userId: dbUsers[i].id,
        });
      }
    }
  }

  await prisma.payment.createManyAndReturn({
    data: paymentsWithUsers,
  });

  const t1 = performance.now();
  console.log(`DB seed: Completed in ${t1 - t0}ms`);
};

seed();
