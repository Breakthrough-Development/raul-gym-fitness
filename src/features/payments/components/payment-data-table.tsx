"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { DataTable } from "@/components/data-table";
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
import { format } from "date-fns";
import { deletePayment } from "../actions/delete-payment";
import { PaymentWithMetadata } from "../types";

export type PaymentType = PaymentWithMetadata & { name: string };

const date: ColumnDef<PaymentType> = {
  id: "date",
  header: "Fecha",
  cell: ({ row }) => <div>{format(row.original.createdAt, "MM/dd/yyyy")}</div>,
};
const status: ColumnDef<PaymentType> = {
  accessorKey: "status",
  header: "Estado",
  cell: ({ row }) => <div className="capitalize">{row.original.status}</div>,
};
const name: ColumnDef<PaymentType> = {
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
const amount: ColumnDef<PaymentType> = {
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
    }).format(amount);

    return <div className="text-right font-medium pr-8">{formatted}</div>;
  },
};

const actionsColumn = (clients: Client[]): ColumnDef<PaymentType> => ({
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
          <DeleteOption id={payment.id} action={deletePayment} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
const pageItemNumber: ColumnDef<PaymentType> = {
  accessorKey: "pageItemNumber",
  header: "N.º",
  cell: ({ row }) => <div>{row.index + 1}</div>,
};
// columns are composed inside the component to capture props when needed

export type PaymentDataTableProps = {
  data: PaymentWithMetadata[];
  pagination: React.ReactElement;
  className?: string;
  clients: Client[];
};

export function PaymentDataTable({
  className,
  data,
  pagination,
  clients,
}: PaymentDataTableProps) {
  const tableData: PaymentType[] = data.map((payment) => ({
    ...payment,
    name: payment.client.firstName + " " + payment.client.lastName,
  }));
  const columns: ColumnDef<PaymentType>[] = [
    pageItemNumber,
    amount,
    name,
    date,
    status,
    actionsColumn(clients),
  ];
  return (
    <DataTable
      className={className}
      data={tableData}
      pagination={pagination}
      columns={columns}
      searchPlaceholder="Filtrar pagos por nombre..."
      searchColumn="name"
    />
  );
}
