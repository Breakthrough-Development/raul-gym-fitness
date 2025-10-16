"use client";

import { Pagination, PaginationSizeOption } from "@/components/pagination";
import { SingleParserBuilder, useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";

type PaginationWrapperProps = {
  paginationSizeOptions: PaginationSizeOption[];
  paginatedMetaData: PaginatedMetaData;
  paginationParser: {
    page: Omit<SingleParserBuilder<number>, "parseServerSide"> & {
      readonly defaultValue: number;
      parseServerSide(value: string | string[] | undefined): number;
    };
    size: Omit<SingleParserBuilder<number>, "parseServerSide"> & {
      readonly defaultValue: number;
      parseServerSide(value: string | string[] | undefined): number;
    };
  };
  paginationOptions: {
    shallow: boolean;
    clearOnDefault: boolean;
  };
  searchParser: Omit<SingleParserBuilder<string>, "parseServerSide"> & {
    readonly defaultValue: string;
    parseServerSide(value: string | string[] | undefined): string;
  };
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
  paginationSizeOptions,
}: PaginationWrapperProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );
  const [search] = useQueryState("search", searchParser);
  const prevSearch = useRef(search);

  useEffect(() => {
    if (search === prevSearch.current) {
      return;
    }
    prevSearch.current = search;
    setPagination({
      ...pagination,
      page: 0,
    });
  }, [pagination, search, setPagination]);

  return (
    <Pagination
      pagination={pagination}
      onPageAndSize={setPagination}
      paginatedMetaData={paginatedMetaData}
      paginationSizeOptions={paginationSizeOptions}
    />
  );
};
