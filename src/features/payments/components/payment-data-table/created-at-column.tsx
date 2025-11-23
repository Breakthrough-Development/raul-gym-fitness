import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PaymentType } from "./types";

export const createdAtColumn: ColumnDef<PaymentType> = {
  id: "createdAt",
  header: "Creado",
  cell: ({ row }) => <div>{format(row.original.createdAt, "MM/dd/yyyy")}</div>,
};
