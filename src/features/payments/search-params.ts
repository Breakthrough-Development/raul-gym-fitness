import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import {
  PAYMENT_PAGINATION_PAGE_DEFAULT,
  PAYMENT_PAGINATION_SIZE_DEFAULT,
  SORT_VALUES,
  TICKET_KEYS,
} from "./constants";

export const paymentSearchKey = "paymentSearch" as const;
export const paymentPageKey = "ticketPage" as const;
export const paymentSizeKey = "ticketSize" as const;

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault(TICKET_KEYS.CREATED_AT),
  sortValue: parseAsString.withDefault(SORT_VALUES.DESC),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const paymentPaginationParser = {
  [paymentPageKey]: parseAsInteger.withDefault(PAYMENT_PAGINATION_PAGE_DEFAULT),
  [paymentSizeKey]: parseAsInteger.withDefault(PAYMENT_PAGINATION_SIZE_DEFAULT),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const PaymentSearchParamsCache = createSearchParamsCache({
  [paymentSearchKey]: searchParser,
  ...sortParser,
  ...paymentPaginationParser,
});

export type ParsedPaymentSearchParams = Awaited<
  ReturnType<typeof PaymentSearchParamsCache.parse>
>;
