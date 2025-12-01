"use client";

import { cn } from "@/lib/utils";
import { StringParserType } from "@/types/nuqs-parsers";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableContent } from "./data-table-content";
import { DataTableHeader } from "./data-table-header";
import { useDataTable } from "./use-data-table";

type DataTableProps<TData> = {
  data: TData[];
  pagination: React.ReactElement;
  className?: string;
  columns: ColumnDef<TData>[];
  searchPlaceholder: string;
  searchKey: string;
  searchParser: StringParserType;
};

export const DataTable = <TData,>({
  data,
  pagination,
  className,
  columns,
  searchPlaceholder,
  searchKey,
  searchParser,
}: DataTableProps<TData>) => {
  const { table, search, setSearch } = useDataTable({
    data,
    columns,
    searchKey,
    searchParser,
  });

  return (
    <section className={cn("w-full", className)}>
      <DataTableHeader
        searchPlaceholder={searchPlaceholder}
        search={search ?? ""}
        onSearchChange={setSearch}
      />
      <DataTableContent table={table} columns={columns} />
      <footer className="py-4">{pagination}</footer>
    </section>
  );
};
