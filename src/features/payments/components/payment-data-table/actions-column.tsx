import { DeleteOption } from "@/components/delete-payment-option";
import { EditPaymentOption } from "@/components/edit-payment-option";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { deletePayment } from "../../actions/delete-payment";
import { PaymentType } from "./types";

export const actionsColumn = (
  clients: Client[],
  onSuccess: () => void
): ColumnDef<PaymentType> => ({
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const payment = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <EditPaymentOption payment={payment} clients={clients} />
          <DeleteOption
            id={payment.id}
            action={deletePayment}
            onSuccess={onSuccess}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
