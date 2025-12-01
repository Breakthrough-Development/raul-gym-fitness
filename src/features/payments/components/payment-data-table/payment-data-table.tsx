"use client";

import { DataTable } from "@/components/data-table";
import { Client } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { paymentSearchKey, searchParser } from "../../search-params";
import { PaymentWithMetadata } from "../../types";
import { actionsColumn } from "./actions-column";
import { amountColumn } from "./amount-column";
import { createdAtColumn } from "./created-at-column";
import { dateColumn } from "./date-column";
import { nameColumn } from "./name-column";
import { pageItemNumberColumn } from "./page-item-number-column";
import { statusColumn } from "./status-column";
import { PaymentType } from "./types";
import { updatedAtColumn } from "./updated-at-column";

type PaymentDataTableProps = {
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
  const queryClient = useQueryClient();
  const handleInvalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["metric"] });

  const tableData: PaymentType[] = data.map((payment) => ({
    ...payment,
    name: payment.client.firstName + " " + payment.client.lastName,
  }));

  const columns: ColumnDef<PaymentType>[] = [
    pageItemNumberColumn,
    amountColumn,
    nameColumn,
    dateColumn,
    createdAtColumn,
    updatedAtColumn,
    statusColumn,
    actionsColumn(clients, handleInvalidate),
  ];

  return (
    <DataTable
      className={className}
      data={tableData}
      pagination={pagination}
      columns={columns}
      searchPlaceholder="Filtrar pagos por nombre..."
      searchKey={paymentSearchKey}
      searchParser={searchParser}
    />
  );
}
