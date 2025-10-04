import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { SORT } from "./constants";

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = parseAsString.withDefault(SORT.NEWEST).withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const SearchParamsCache = createSearchParamsCache({
  search: searchParser,
  sort: sortParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof SearchParamsCache.parse>
>;
