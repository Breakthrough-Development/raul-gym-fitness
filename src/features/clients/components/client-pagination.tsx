"use client";

import { PaginationWrapper } from "@/components/pagination-wrapper";
import { PaginatedData } from "@/types/pagination";
import {
  clientPageKey,
  clientPaginationOptions,
  clientPaginationParser,
  clientSearchKey,
  clientSizeKey,
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
  return (
    <PaginationWrapper
      paginatedMetaData={paginatedMetaData}
      paginationParser={clientPaginationParser}
      paginationOptions={clientPaginationOptions}
      searchParser={searchParser}
      searchKey={clientSearchKey}
      pageKey={clientPageKey}
      sizeKey={clientSizeKey}
      paginationSizeOptions={CLIENT_PAGINATION_SIZE_OPTIONS}
    />
  );
};
