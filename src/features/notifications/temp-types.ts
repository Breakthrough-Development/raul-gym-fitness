// Temporary types until Prisma migration is run
export enum RecipientType {
  ALL = "ALL",
  SELECTED = "SELECTED",
}

export enum MembershipFilter {
  DIARIO = "DIARIO",
  MENSUAL = "MENSUAL",
  BOTH = "BOTH",
}

export enum RecurrenceType {
  ONE_TIME = "ONE_TIME",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export enum ScheduledNotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}
