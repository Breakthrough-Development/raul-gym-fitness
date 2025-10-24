import { z } from "zod";

export const notificationSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  search: z.string().default(""),
  status: z.enum(["PENDING", "SENT", "FAILED", "CANCELLED"]).optional(),
  sort: z.enum(["createdAt", "sendDate", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type NotificationSearchParams = z.infer<
  typeof notificationSearchParamsSchema
>;

export function parseNotificationSearchParams(
  searchParams: URLSearchParams
): NotificationSearchParams {
  return notificationSearchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  );
}
