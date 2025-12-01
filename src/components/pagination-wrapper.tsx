"use client";

import { Pagination, PaginationSizeOption } from "@/components/pagination";
import { usePaginationWithSearchReset } from "@/hooks/use-pagination-with-search-reset";
import { SingleParserBuilder } from "nuqs";

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

type PaginationWrapperProps = {
  paginationSizeOptions: PaginationSizeOption[];
  paginatedMetaData: PaginatedMetaData;
  paginationParser: Record<string, PaginationParserType>;
  paginationOptions: {
    shallow: boolean;
    clearOnDefault: boolean;
  };
  searchParser: SearchParserType;
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
  const { pagination, setPagination } = usePaginationWithSearchReset({
    pageKey,
    sizeKey,
    searchKey,
    paginationParser,
    paginationOptions,
    searchParser,
  });

  return (
    <Pagination
      pagination={pagination}
      onPageAndSize={setPagination}
      paginatedMetaData={paginatedMetaData}
      paginationSizeOptions={paginationSizeOptions}
    />
  );
};
