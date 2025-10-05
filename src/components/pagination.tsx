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
