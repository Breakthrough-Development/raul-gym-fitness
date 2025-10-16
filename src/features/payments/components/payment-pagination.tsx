"use client";
import {
  PaginatedMetaData,
  PaginationWrapper,
} from "@/components/pagination-wrapper";
import { PAYMENT_PAGINATION_SIZE_OPTIONS } from "../constants";
import {
  paginationOptions,
  paymentPaginationParser,
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
      paginationParser={paymentPaginationParser}
      paginationOptions={paginationOptions}
      searchParser={searchParser}
      paginationSizeOptions={PAYMENT_PAGINATION_SIZE_OPTIONS}
    />
  );
};
