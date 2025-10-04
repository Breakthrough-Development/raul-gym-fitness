import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const SearchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof SearchParamsCache.parse>
>;
