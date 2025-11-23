import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { PaymentType } from "./types";

export const nameColumn: ColumnDef<PaymentType> = {
  accessorKey: "name",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <ArrowUpDown />
      </Button>
    );
  },
  cell: ({ row }) => <div>{row.getValue("name") as string}</div>,
};
