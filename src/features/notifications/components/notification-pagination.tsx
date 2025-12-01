"use client";

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState } from "nuqs";
import {
  NOTIFICATION_PAGINATION_PAGE_DEFAULT,
  notificationPageKey,
  notificationPaginationParser,
} from "../search-params";

type NotificationPaginationProps = {
  totalPages: number;
};

export const NotificationPagination = ({
  totalPages,
}: NotificationPaginationProps) => {
  const [page, setPage] = useQueryState(
    notificationPageKey,
    notificationPaginationParser[notificationPageKey]
  );

  const currentPage = page ?? NOTIFICATION_PAGINATION_PAGE_DEFAULT;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(currentPage - 1)} />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationButton
              isActive={pageNum === currentPage}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </PaginationButton>
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => setPage(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
