"use client";

import {
  NumericParserType,
  PaginationOptions,
  StringParserType,
} from "@/types/nuqs-parsers";
import { PageAndSize } from "@/types/pagination";
import { SingleParserBuilder, useQueryState, useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useRef } from "react";

type UsePaginationWithSearchResetConfig = {
  pageKey: string;
  sizeKey: string;
  searchKey: string;
  paginationParser: Record<string, NumericParserType>;
  paginationOptions: PaginationOptions;
  searchParser: StringParserType;
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
        (paginationParser as Record<string, NumericParserType>)[pageKey] ??
        paginationParser.page,
      [sizeKey]:
        (paginationParser as Record<string, NumericParserType>)[sizeKey] ??
        paginationParser.size,
    }),
    [pageKey, sizeKey, paginationParser]
  );

  const [rawPagination, setRawPagination] = useQueryStates(
    derivedPaginationParsers as Record<string, SingleParserBuilder<number>>,
    paginationOptions
  );

  const pagination = useMemo<PageAndSize>(
    () => ({
      page: (rawPagination as Record<string, number>)[pageKey] ?? 0,
      size: (rawPagination as Record<string, number>)[sizeKey] ?? 0,
    }),
    [rawPagination, pageKey, sizeKey]
  );

  const setPagination = useCallback(
    ({ page, size }: PageAndSize) =>
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
