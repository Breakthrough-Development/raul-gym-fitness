"use client";

import { Pagination } from "@/components/pagination";
import { usePaginationWithSearchReset } from "@/hooks/use-pagination-with-search-reset";
import {
  NumericParserType,
  PaginationOptions,
  StringParserType,
} from "@/types/nuqs-parsers";
import { PaginatedMetaData, PaginationSizeOption } from "@/types/pagination";

// Re-export for backward compatibility
export type { PaginatedMetaData } from "@/types/pagination";

type PaginationWrapperProps = {
  paginationSizeOptions: PaginationSizeOption[];
  paginatedMetaData: PaginatedMetaData;
  paginationParser: Record<string, NumericParserType>;
  paginationOptions: PaginationOptions;
  searchParser: StringParserType;
  searchKey?: string;
  pageKey?: string;
  sizeKey?: string;
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
