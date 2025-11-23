import { ColumnDef } from "@tanstack/react-table";
import { PaymentType } from "./types";

export const statusColumn: ColumnDef<PaymentType> = {
  accessorKey: "status",
  header: "Estado",
  cell: ({ row }) => <div className="capitalize">{row.original.status}</div>,
};
