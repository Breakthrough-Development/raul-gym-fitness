-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('OPEN', 'PAID', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('DAILY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."NotificationCohort" AS ENUM ('PRE_EOM', 'POST_EOM');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('SENT', 'SKIPPED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."RecipientType" AS ENUM ('ALL', 'SELECTED');

-- CreateEnum
CREATE TYPE "public"."MembershipFilter" AS ENUM ('DAILY', 'MONTHLY', 'BOTH');

-- CreateEnum
CREATE TYPE "public"."RecurrenceType" AS ENUM ('ONE_TIME', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."ScheduledNotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'OPEN',
    "membership" "public"."MembershipStatus" NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsappNotification" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "cohort" "public"."NotificationCohort" NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL,
    "providerMessageId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduledNotification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipientType" "public"."RecipientType" NOT NULL DEFAULT 'ALL',
    "selectedClientIds" TEXT[],
    "membershipFilter" "public"."MembershipFilter",
    "sendDate" TIMESTAMP(3) NOT NULL,
    "recurrence" "public"."RecurrenceType" NOT NULL DEFAULT 'ONE_TIME',
    "templateName" TEXT NOT NULL,
    "status" "public"."ScheduledNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "public"."Client"("email");

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "public"."Payment"("clientId");

-- CreateIndex
CREATE INDEX "WhatsappNotification_cohort_year_month_idx" ON "public"."WhatsappNotification"("cohort", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappNotification_clientId_cohort_year_month_key" ON "public"."WhatsappNotification"("clientId", "cohort", "year", "month");

-- CreateIndex
CREATE INDEX "ScheduledNotification_status_sendDate_idx" ON "public"."ScheduledNotification"("status", "sendDate");

-- CreateIndex
CREATE INDEX "ScheduledNotification_recipientType_idx" ON "public"."ScheduledNotification"("recipientType");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappNotification" ADD CONSTRAINT "WhatsappNotification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
