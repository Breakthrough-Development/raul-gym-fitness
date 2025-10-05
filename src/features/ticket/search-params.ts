import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import {
  PAGINATION_PAGE_DEFAULT,
  PAGINATION_SIZE_DEFAULT,
  SORT_VALUES,
  TICKET_KEYS,
} from "./constants";

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

export const paginationParser = {
  page: parseAsInteger.withDefault(PAGINATION_PAGE_DEFAULT),
  size: parseAsInteger.withDefault(PAGINATION_SIZE_DEFAULT),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const SearchParamsCache = createSearchParamsCache({
  search: searchParser,
  ...sortParser,
  ...paginationParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof SearchParamsCache.parse>
>;
