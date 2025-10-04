"use client";

import { Pagination } from "@/components/pagination";
import { useQueryStates } from "nuqs";
import { paginationOptions, paginationParser } from "../search-params";

type TicketPaginationProps = {
  paginatedMetaData: {
    count: number;
    hasNextPage: boolean;
  };
};

export const TicketPagination = ({
  paginatedMetaData,
}: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );
  return (
    <Pagination
      pagination={pagination}
      onPageAndSize={setPagination}
      paginatedMetaData={paginatedMetaData}
    />
  );
};
