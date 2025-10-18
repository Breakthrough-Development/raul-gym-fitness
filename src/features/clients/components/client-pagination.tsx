"use client";

import { Pagination } from "@/components/pagination";
import { PaginatedData } from "@/types/pagination";
import { useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import {
  clientPaginationOptions,
  clientPaginationParser,
  searchParser,
} from "../client-search-params";
import { CLIENT_PAGINATION_SIZE_OPTIONS } from "../constants";
import { ClientWithMetadata } from "../types";

type ClientPaginationProps = {
  paginatedMetaData: PaginatedData<ClientWithMetadata>["metadata"];
};

export const ClientPagination = ({
  paginatedMetaData,
}: ClientPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    clientPaginationParser,
    clientPaginationOptions
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
      paginationSizeOptions={CLIENT_PAGINATION_SIZE_OPTIONS}
    />
  );
};
