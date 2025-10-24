import {
  MembershipFilter,
  RecipientType,
  RecurrenceType,
} from "@prisma/client";

export const RECIPIENT_TYPE_OPTIONS = [
  { value: RecipientType.ALL, label: "All Clients" },
  { value: RecipientType.SELECTED, label: "Selected Clients" },
] as const;

export const MEMBERSHIP_FILTER_OPTIONS = [
  { value: null, label: "All Memberships" },
  { value: MembershipFilter.DIARIO, label: "Daily Members" },
  { value: MembershipFilter.MENSUAL, label: "Monthly Members" },
  { value: MembershipFilter.BOTH, label: "Both Daily & Monthly" },
] as const;

export const RECURRENCE_OPTIONS = [
  { value: RecurrenceType.ONE_TIME, label: "One Time" },
  { value: RecurrenceType.WEEKLY, label: "Weekly" },
  { value: RecurrenceType.MONTHLY, label: "Monthly" },
] as const;

export const NOTIFICATION_STATUS_LABELS = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
} as const;
