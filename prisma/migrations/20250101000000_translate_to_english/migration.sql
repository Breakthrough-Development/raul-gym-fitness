-- Rename enum types
ALTER TYPE "EstadoMembresia" RENAME TO "MembershipStatus";
ALTER TYPE "EstadoPago" RENAME TO "PaymentStatus";

-- Update enum values for MembershipStatus
ALTER TYPE "MembershipStatus" RENAME VALUE 'DIARIO' TO 'DAILY';
ALTER TYPE "MembershipStatus" RENAME VALUE 'MENSUAL' TO 'MONTHLY';

-- Update enum values for PaymentStatus
ALTER TYPE "PaymentStatus" RENAME VALUE 'ABIERTO' TO 'OPEN';
ALTER TYPE "PaymentStatus" RENAME VALUE 'PAGADO' TO 'PAID';
ALTER TYPE "PaymentStatus" RENAME VALUE 'PENDIENTE' TO 'PENDING';
ALTER TYPE "PaymentStatus" RENAME VALUE 'FALLIDO' TO 'FAILED';

-- Update enum values for MembershipFilter
ALTER TYPE "MembershipFilter" RENAME VALUE 'DIARIO' TO 'DAILY';
ALTER TYPE "MembershipFilter" RENAME VALUE 'MENSUAL' TO 'MONTHLY';

-- Rename tables
ALTER TABLE "Usuario" RENAME TO "User";
ALTER TABLE "Cliente" RENAME TO "Client";
ALTER TABLE "Sesion" RENAME TO "Session";
ALTER TABLE "Pago" RENAME TO "Payment";

-- Rename columns in User table
ALTER TABLE "User" RENAME COLUMN "nombre" TO "firstName";
ALTER TABLE "User" RENAME COLUMN "apellido" TO "lastName";
ALTER TABLE "User" RENAME COLUMN "usuario" TO "username";
ALTER TABLE "User" RENAME COLUMN "telefono" TO "phone";

-- Rename columns in Client table
ALTER TABLE "Client" RENAME COLUMN "nombre" TO "firstName";
ALTER TABLE "Client" RENAME COLUMN "apellido" TO "lastName";
ALTER TABLE "Client" RENAME COLUMN "telefono" TO "phone";
ALTER TABLE "Client" RENAME COLUMN "creado" TO "createdAt";

-- Rename columns in Session table
ALTER TABLE "Session" RENAME COLUMN "expira" TO "expiresAt";
ALTER TABLE "Session" RENAME COLUMN "usuarioId" TO "userId";

-- Rename columns in Payment table
ALTER TABLE "Payment" RENAME COLUMN "monto" TO "amount";
ALTER TABLE "Payment" RENAME COLUMN "estado" TO "status";
ALTER TABLE "Payment" RENAME COLUMN "membresia" TO "membership";
ALTER TABLE "Payment" RENAME COLUMN "clienteId" TO "clientId";
ALTER TABLE "Payment" RENAME COLUMN "creado" TO "createdAt";
ALTER TABLE "Payment" RENAME COLUMN "actualizado" TO "updatedAt";

-- Rename columns in WhatsappNotification table
ALTER TABLE "WhatsappNotification" RENAME COLUMN "clienteId" TO "clientId";

-- Rename foreign key constraints (PostgreSQL automatically updates constraint names when tables/columns are renamed, but we should verify)
-- The constraint names will be automatically updated by PostgreSQL when we rename the tables/columns

-- Update the relation name in Client table (this is handled by Prisma, but we need to ensure the foreign key is correct)
-- The foreign key from Payment to Client will be automatically updated

