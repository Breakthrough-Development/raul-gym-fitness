"use client";

import type { StringParserType } from "@/types/nuqs-parsers";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useQueryState } from "nuqs";
import { useState } from "react";

type UseDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchKey: string;
  searchParser: StringParserType;
};

export const useDataTable = <TData>({
  data,
  columns,
  searchKey,
  searchParser,
}: UseDataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useQueryState(searchKey, searchParser);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  return {
    table,
    search,
    setSearch,
  };
};
