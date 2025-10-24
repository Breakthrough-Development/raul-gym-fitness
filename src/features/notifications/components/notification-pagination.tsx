"use client";

import { Pagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type NotificationPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export const NotificationPagination = ({
  currentPage,
  totalPages,
}: NotificationPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};
