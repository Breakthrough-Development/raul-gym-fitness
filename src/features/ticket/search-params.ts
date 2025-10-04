import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { SORT_LABELS, SORT_VALUES, TICKET_KEYS } from "./constants";

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault(TICKET_KEYS.CREATED_AT),
  sortValue: parseAsString.withDefault(SORT_VALUES.DESC),
  sortLabel: parseAsString.withDefault(SORT_LABELS.NEWEST),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const SearchParamsCache = createSearchParamsCache({
  search: searchParser,
  ...sortParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof SearchParamsCache.parse>
>;
