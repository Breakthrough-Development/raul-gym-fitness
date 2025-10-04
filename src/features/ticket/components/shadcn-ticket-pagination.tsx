"use client";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryStates } from "nuqs";
import { paginationOptions, paginationParser } from "../search-params";

export const ShadcnTicketPagination = () => {
  const [page, setPage] = useQueryStates(paginationParser, paginationOptions);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page.page < 1}
            onClick={() => setPage({ ...page, page: page.page - 1 })}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationButton
            onClick={() => setPage({ ...page, page: page.page })}
          >
            {page.page}
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis
            onClick={() => setPage({ ...page, page: page.page + 1 })}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage({ ...page, page: page.page + 1 })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
