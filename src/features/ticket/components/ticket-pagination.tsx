"use client";

import { Pagination } from "@/components/pagination";
import { PaginatedData } from "@/types/pagination";
import { useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { PAGINATION_SIZE_OPTIONS } from "../constants";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";
import { TicketWithMetadata } from "../types/types";

type TicketPaginationProps = {
  paginatedMetaData: PaginatedData<TicketWithMetadata>["metadata"];
};

export const TicketPagination = ({
  paginatedMetaData,
}: TicketPaginationProps) => {
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
      paginationSizeOptions={PAGINATION_SIZE_OPTIONS}
    />
  );
};
