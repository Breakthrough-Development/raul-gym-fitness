import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import {
  CLIENT_KEYS,
  CLIENT_PAGINATION_PAGE_DEFAULT,
  CLIENT_PAGINATION_SIZE_DEFAULT,
  SORT_VALUES,
} from "./constants";

export const clientSearchKey = "clientSearch" as const;
export const clientPageKey = "clientPage" as const;
export const clientSizeKey = "clientSize" as const;

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault(CLIENT_KEYS.CREATED_AT),
  sortValue: parseAsString.withDefault(SORT_VALUES.DESC),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const clientPaginationParser = {
  [clientPageKey]: parseAsInteger.withDefault(CLIENT_PAGINATION_PAGE_DEFAULT),
  [clientSizeKey]: parseAsInteger.withDefault(CLIENT_PAGINATION_SIZE_DEFAULT),
};

export const clientPaginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const ClientSearchParamsCache = createSearchParamsCache({
  [clientSearchKey]: searchParser,
  ...sortParser,
  ...clientPaginationParser,
});

export type ClientParsedSearchParams = Awaited<
  ReturnType<typeof ClientSearchParamsCache.parse>
>;
