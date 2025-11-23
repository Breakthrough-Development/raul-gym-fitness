import { ColumnDef } from "@tanstack/react-table";
import { PaymentType } from "./types";

export const pageItemNumberColumn: ColumnDef<PaymentType> = {
  accessorKey: "pageItemNumber",
  header: "N.º",
  cell: ({ row }) => <div>{row.index + 1}</div>,
};
