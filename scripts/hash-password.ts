#!/usr/bin/env tsx
/**
 * Script to hash a password using Argon2.
 * The output can be copied and pasted directly into the database.
 * 
 * Usage: bun run scripts/hash-password.ts <password>
 * 
 * Example:
 *   bun run scripts/hash-password.ts "myNewPassword123"
 */

import { hash } from "@node-rs/argon2";

const hashPassword = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: bun run scripts/hash-password.ts <password>");
    console.error("\nExample:");
    console.error('  bun run scripts/hash-password.ts "myNewPassword123"');
    process.exit(1);
  }

  const password = args[0];

  if (password.length < 6) {
    console.error("✗ Error: Password must be at least 6 characters long");
    process.exit(1);
  }

  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    console.log("\n✓ Password hashed successfully!\n");
    console.log("─".repeat(60));
    console.log("Copy this hash and paste it into the database:");
    console.log("─".repeat(60));
    console.log(passwordHash);
    console.log("─".repeat(60));
    console.log("\nSQL update command:");
    console.log(`UPDATE "User" SET password = '${passwordHash}' WHERE email = 'YOUR_EMAIL_HERE';`);
  } catch (error) {
    console.error("✗ Error hashing password:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

hashPassword();

