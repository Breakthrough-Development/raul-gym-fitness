"use client";
import {
  PaginatedMetaData,
  PaginationWrapper,
} from "@/components/pagination-wrapper";
import { PAGINATION_SIZE_OPTIONS } from "../constants";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";

type PaymentPaginationProps = {
  paginatedMetaData: PaginatedMetaData;
};

export const PaymentPagination = ({
  paginatedMetaData,
}: PaymentPaginationProps) => {
  return (
    <PaginationWrapper
      paginatedMetaData={paginatedMetaData}
      paginationParser={paginationParser}
      paginationOptions={paginationOptions}
      searchParser={searchParser}
      paginationSizeOptions={PAGINATION_SIZE_OPTIONS}
    />
  );
};
