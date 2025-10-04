"use client";

import { Button } from "@/components/ui/button";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPageAndSize: (pageAndSize: PageAndSize) => void;
  paginatedMetaData: {
    count: number;
    hasNextPage: boolean;
  };
};

export const Pagination = ({
  pagination,
  onPageAndSize,
  paginatedMetaData: { count, hasNextPage },
}: PaginationProps) => {
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset + pagination.size - 1;
  const actualEndOffset = Math.min(endOffset, count);

  const label = `${startOffset} - ${actualEndOffset} of ${count}`;

  const handlePreviousPage = () => {
    onPageAndSize({ ...pagination, page: pagination.page - 1 });
  };

  const handleNextPage = () => {
    onPageAndSize({ ...pagination, page: pagination.page + 1 });
  };
  const PreviousButton = () => (
    <Button
      disabled={pagination.page < 1}
      size="sm"
      variant="outline"
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );
  const NextButton = () => (
    <Button
      disabled={!hasNextPage}
      size="sm"
      variant="outline"
      onClick={handleNextPage}
    >
      Next
    </Button>
  );
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        <PreviousButton />
        <NextButton />
      </div>
    </div>
  );
};
