"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  Header,
  HeaderGroup,
  Row,
  Table as TableType,
} from "@tanstack/react-table";

type DataTableContentProps<TData> = {
  table: TableType<TData>;
  columns: ColumnDef<TData>[];
};

export const DataTableContent = <TData,>({
  table,
  columns,
}: DataTableContentProps<TData>) => {
  const { getRowModel, getHeaderGroups } = table;
  const rows = getRowModel().rows;

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {getHeaderGroups().map((headerGroup) => (
            <DataTableHeaderRow
              key={headerGroup.id}
              headerGroup={headerGroup}
            />
          ))}
        </TableHeader>
        <TableBody>
          {rows.length === 0 && <EmptyRow colSpan={columns.length} />}
          {rows.map((row) => (
            <DataTableRowCell key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Co-located helper components

const DataTableHeaderRow = <TData,>({
  headerGroup,
}: {
  headerGroup: HeaderGroup<TData>;
}) => (
  <TableRow>
    {headerGroup.headers.map((header) => (
      <DataTableHeadCell key={header.id} header={header} />
    ))}
  </TableRow>
);

const DataTableHeadCell = <TData,>({
  header,
}: {
  header: Header<TData, unknown>;
}) => {
  if (header.isPlaceholder) return null;

  return (
    <TableHead>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};

const DataTableRowCell = <TData,>({ row }: { row: Row<TData> }) => (
  <TableRow data-state={row.getIsSelected() && "selected"}>
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
);

const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-24 text-center">
      No results.
    </TableCell>
  </TableRow>
);
