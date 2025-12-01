"use client";

import { SingleParserBuilder, useQueryState, useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useRef } from "react";

type PaginationParserType = Omit<
  SingleParserBuilder<number>,
  "parseServerSide"
> & {
  readonly defaultValue: number;
  parseServerSide(value: string | string[] | undefined): number;
};

type SearchParserType = Omit<SingleParserBuilder<string>, "parseServerSide"> & {
  readonly defaultValue: string;
  parseServerSide(value: string | string[] | undefined): string;
};

type UsePaginationWithSearchResetConfig = {
  pageKey: string;
  sizeKey: string;
  searchKey: string;
  paginationParser: Record<string, PaginationParserType>;
  paginationOptions: { shallow: boolean; clearOnDefault: boolean };
  searchParser: SearchParserType;
};

type Pagination = {
  page: number;
  size: number;
};

/**
 * Custom hook that manages pagination state via URL params and automatically
 * resets to page 0 when the search query changes.
 *
 * This hook encapsulates:
 * - URL-based pagination state (page, size)
 * - Search query monitoring
 * - Automatic page reset when search changes (not on initial mount)
 */
export const usePaginationWithSearchReset = ({
  pageKey,
  sizeKey,
  searchKey,
  paginationParser,
  paginationOptions,
  searchParser,
}: UsePaginationWithSearchResetConfig) => {
  // Derive the correct parsers based on dynamic keys
  const derivedPaginationParsers = useMemo(
    () => ({
      [pageKey]:
        (paginationParser as Record<string, PaginationParserType>)[pageKey] ??
        paginationParser.page,
      [sizeKey]:
        (paginationParser as Record<string, PaginationParserType>)[sizeKey] ??
        paginationParser.size,
    }),
    [pageKey, sizeKey, paginationParser]
  );

  const [rawPagination, setRawPagination] = useQueryStates(
    derivedPaginationParsers as Record<string, SingleParserBuilder<number>>,
    paginationOptions
  );

  const pagination = useMemo<Pagination>(
    () => ({
      page: (rawPagination as Record<string, number>)[pageKey] ?? 0,
      size: (rawPagination as Record<string, number>)[sizeKey] ?? 0,
    }),
    [rawPagination, pageKey, sizeKey]
  );

  const setPagination = useCallback(
    ({ page, size }: Pagination) =>
      setRawPagination({ [pageKey]: page, [sizeKey]: size }),
    [setRawPagination, pageKey, sizeKey]
  );

  // Watch search changes to reset pagination
  const [search] = useQueryState(searchKey, searchParser);
  const prevSearchRef = useRef(search);

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search;
      setRawPagination({ [pageKey]: 0 });
    }
  }, [search, setRawPagination, pageKey]);

  return { pagination, setPagination };
};
