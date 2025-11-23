import { Button } from "@/components/ui/button";
import { toDollarAndCent } from "@/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { PaymentType } from "./types";

export const amountColumn: ColumnDef<PaymentType> = {
  accessorKey: "amount",
  header: ({ column }) => {
    return (
      <div className="flex justify-end  w-full">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          <ArrowUpDown />
        </Button>
      </div>
    );
  },
  cell: ({ row }) => {
    const amount = row.original.amount;

    // Format the amount as a dollar amount
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(toDollarAndCent(Number(amount)));

    return <div className="text-right font-medium pr-8">{formatted}</div>;
  },
};
