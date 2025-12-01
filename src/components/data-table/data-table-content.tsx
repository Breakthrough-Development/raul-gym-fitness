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
  table: { getRowModel, getHeaderGroups },
  columns: { length: columnCount },
}: DataTableContentProps<TData>) => {
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
          {rows.length === 0 && <EmptyRow colSpan={columnCount} />}
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
  headerGroup: { id, headers },
}: {
  headerGroup: HeaderGroup<TData>;
}) => (
  <TableRow key={id}>
    {headers.map((header) => (
      <DataTableHeadCell key={header.id} header={header} />
    ))}
  </TableRow>
);

const DataTableHeadCell = <TData,>({
  header: { isPlaceholder, column, getContext },
}: {
  header: Header<TData, unknown>;
}) => {
  if (isPlaceholder) return null;

  return (
    <TableHead>{flexRender(column.columnDef.header, getContext())}</TableHead>
  );
};

const DataTableRowCell = <TData,>({
  row: { getIsSelected, getVisibleCells },
}: {
  row: Row<TData>;
}) => (
  <TableRow data-state={getIsSelected() && "selected"}>
    {getVisibleCells().map((cell) => (
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
