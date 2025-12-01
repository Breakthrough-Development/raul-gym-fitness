"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { StringParserType } from "@/types/nuqs-parsers";
import { useDataTable } from "./hooks/use-data-table";

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
  const { table, search, handleSearch } = useDataTable({
    data,
    columns,
    searchKey,
    searchParser,
  });

  return (
    <section className={cn("w-full", className)}>
      <header className="flex items-center py-4 gap-x-2">
        <Input
          placeholder={searchPlaceholder}
          defaultValue={search}
          onChange={handleSearch}
          className="max-w-sm text-base md:text-lg"
        />
      </header>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <footer className="py-4">{pagination}</footer>
    </section>
  );
};
