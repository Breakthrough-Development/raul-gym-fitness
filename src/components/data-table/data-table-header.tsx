"use client";

import { SearchInput } from "@/components/search-input";

type DataTableHeaderProps = {
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
};

export const DataTableHeader = ({
  searchPlaceholder,
  search,
  onSearchChange,
}: DataTableHeaderProps) => {
  return (
    <header className="flex items-center py-4 gap-x-2">
      <SearchInput
        placeholder={searchPlaceholder}
        value={search}
        onChange={onSearchChange}
      />
    </header>
  );
};
