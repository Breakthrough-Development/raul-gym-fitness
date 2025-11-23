import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PaymentType } from "./types";

export const dateColumn: ColumnDef<PaymentType> = {
  id: "date",
  header: "Fecha",
  cell: ({ row }) => (
    <div>{format(row.original.paymentDate, "MM/dd/yyyy")}</div>
  ),
};
