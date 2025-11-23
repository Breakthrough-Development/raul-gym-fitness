import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PaymentType } from "./types";

export const updatedAtColumn: ColumnDef<PaymentType> = {
  id: "updatedAt",
  header: "Actualizado",
  cell: ({ row }) => <div>{format(row.original.updatedAt, "MM/dd/yyyy")}</div>,
};
