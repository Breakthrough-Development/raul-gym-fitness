"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGINATION_SIZE_OPTIONS } from "@/features/ticket/constants";
import { PaginatedData } from "@/types/pagination";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPageAndSize: (pageAndSize: PageAndSize) => void;
  paginatedMetaData: PaginatedData<unknown>["metadata"];
};

export const Pagination = ({
  pagination,
  onPageAndSize,
  paginatedMetaData: { count },
}: PaginationProps) => {
  const maxPage = Math.max(0, Math.ceil(count / pagination.size) - 1);
  const isFirstPage = pagination.page <= 0;
  const isLastPage = pagination.page >= maxPage;

  const startOffset = count === 0 ? 0 : pagination.page * pagination.size + 1;
  const endOffset = startOffset + pagination.size - 1;
  const actualEndOffset = Math.min(endOffset, count);

  const label = `${startOffset} - ${actualEndOffset} of ${count}`;

  const handlePreviousPage = () => {
    if (isFirstPage) return;
    onPageAndSize({ ...pagination, page: pagination.page - 1 });
  };

  const handleNextPage = () => {
    if (isLastPage) return;
    onPageAndSize({ ...pagination, page: pagination.page + 1 });
  };
  const PreviousButton = () => (
    <Button
      disabled={isFirstPage}
      size="sm"
      variant="outline"
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );
  const NextButton = () => (
    <Button
      disabled={isLastPage}
      size="sm"
      variant="outline"
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  const handleChangeSize = (size: string) => {
    onPageAndSize({ page: 0, size: parseInt(size) });
  };

  const sizeButton = (
    <Select
      defaultValue={pagination.size.toString()}
      onValueChange={handleChangeSize}
    >
      <SelectTrigger className="h-[36px]">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {PAGINATION_SIZE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        {sizeButton}
        <PreviousButton />
        <NextButton />
      </div>
    </div>
  );
};
