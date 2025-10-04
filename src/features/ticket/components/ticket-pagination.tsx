"use client";

import { Pagination } from "@/components/pagination";
import { useQueryStates } from "nuqs";
import { paginationOptions, paginationParser } from "../search-params";

export const TicketPagination = () => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );
  return <Pagination pagination={pagination} onPageAndSize={setPagination} />;
};
