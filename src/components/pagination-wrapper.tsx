"use client";

import { Pagination, PaginationSizeOption } from "@/components/pagination";
import { SingleParserBuilder, useQueryState, useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";

type PaginationWrapperProps = {
  paginationSizeOptions: PaginationSizeOption[];
  paginatedMetaData: PaginatedMetaData;
  paginationParser: Record<
    string,
    Omit<SingleParserBuilder<number>, "parseServerSide"> & {
      readonly defaultValue: number;
      parseServerSide(value: string | string[] | undefined): number;
    }
  >;
  paginationOptions: {
    shallow: boolean;
    clearOnDefault: boolean;
  };
  searchParser: Omit<SingleParserBuilder<string>, "parseServerSide"> & {
    readonly defaultValue: string;
    parseServerSide(value: string | string[] | undefined): string;
  };
  searchKey?: string;
  pageKey?: string;
  sizeKey?: string;
};

export type PaginatedMetaData = {
  count: number;
  hasNextPage: boolean;
  cursor?: {
    id: string;
    createdAt: number;
  };
};

export const PaginationWrapper = ({
  paginatedMetaData,
  paginationParser,
  paginationOptions,
  searchParser,
  searchKey = "search",
  pageKey = "page",
  sizeKey = "size",
  paginationSizeOptions,
}: PaginationWrapperProps) => {
  const derivedPaginationParsers = {
    [pageKey]:
      (
        paginationParser as Record<
          string,
          PaginationWrapperProps["paginationParser"]["page"]
        >
      )[pageKey] ?? paginationParser.page,
    [sizeKey]:
      (
        paginationParser as Record<
          string,
          PaginationWrapperProps["paginationParser"]["size"]
        >
      )[sizeKey] ?? paginationParser.size,
  } as Record<
    string,
    | PaginationWrapperProps["paginationParser"]["page"]
    | PaginationWrapperProps["paginationParser"]["size"]
  >;
  const [rawPagination, setRawPagination] = useQueryStates(
    derivedPaginationParsers as Record<string, SingleParserBuilder<number>>,
    paginationOptions
  );
  const pagination = useMemo(
    () => ({
      page: (rawPagination as Record<string, number>)[pageKey] ?? 0,
      size: (rawPagination as Record<string, number>)[sizeKey] ?? 0,
    }),
    [rawPagination, pageKey, sizeKey]
  );
  const setPagination = useCallback(
    ({ page, size }: { page: number; size: number }) =>
      setRawPagination({ [pageKey]: page, [sizeKey]: size } as Record<
        string,
        number
      >),
    [setRawPagination, pageKey, sizeKey]
  );
  const [search] = useQueryState(searchKey, searchParser);

  // Reset pagination when search changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  }, [search, setPagination]);

  return (
    <Pagination
      pagination={pagination}
      onPageAndSize={setPagination}
      paginatedMetaData={paginatedMetaData}
      paginationSizeOptions={paginationSizeOptions}
    />
  );
};
