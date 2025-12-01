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
  { value: MembershipFilter.DAILY, label: "Daily Members" },
  { value: MembershipFilter.MONTHLY, label: "Monthly Members" },
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

export const NOTIFICATION_STATUS_COLORS = {
  PENDING: "text-yellow-600",
  SENT: "text-green-600",
  FAILED: "text-red-600",
  CANCELLED: "text-gray-600",
} as const;

/**
 * Get a label from an options array by value.
 * Useful for displaying human-readable labels from enum-like option arrays.
 */
export const getOptionLabel = <T extends { value: unknown; label: string }>(
  options: readonly T[],
  value: unknown
): string | undefined => options.find((opt) => opt.value === value)?.label;
