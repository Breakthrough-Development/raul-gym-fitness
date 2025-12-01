import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";

// nuqs keys
export const notificationSearchKey = "notificationSearch" as const;
export const notificationPageKey = "notificationPage" as const;
export const notificationSizeKey = "notificationSize" as const;

// Defaults
export const NOTIFICATION_PAGINATION_PAGE_DEFAULT = 1;
export const NOTIFICATION_PAGINATION_SIZE_DEFAULT = 10;
export const NOTIFICATION_PAGINATION_SIZE_OPTIONS = [5, 10, 20, 50];

// nuqs parsers
export const notificationSearchParser = parseAsString
  .withDefault("")
  .withOptions({
    shallow: false,
    clearOnDefault: true,
  });

export const notificationPaginationParser = {
  [notificationPageKey]: parseAsInteger.withDefault(
    NOTIFICATION_PAGINATION_PAGE_DEFAULT
  ),
  [notificationSizeKey]: parseAsInteger.withDefault(
    NOTIFICATION_PAGINATION_SIZE_DEFAULT
  ),
};

export const notificationPaginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

// Server-side cache for parsing search params (nuqs style)
export const NotificationSearchParamsCache = createSearchParamsCache({
  [notificationSearchKey]: notificationSearchParser,
  ...notificationPaginationParser,
});

// Legacy zod schema (for backwards compatibility)
export const notificationSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  search: z.string().default(""),
  status: z.enum(["PENDING", "SENT", "FAILED", "CANCELLED"]).optional(),
  sort: z.enum(["createdAt", "sendDate", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// Legacy type for backward compatibility with existing pages
export type NotificationSearchParams = z.infer<
  typeof notificationSearchParamsSchema
>;

export function parseNotificationSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): NotificationSearchParams {
  return notificationSearchParamsSchema.parse(searchParams);
}
