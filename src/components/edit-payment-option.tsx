"use client";

import { useFormDialog } from "@/components/form-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PaymentUpsertForm } from "@/features/payments/components/payment-upsert-form";
import { PaymentWithMetadata } from "@/features/payments/types";
import { Cliente } from "@prisma/client";
import { LucidePencil } from "lucide-react";

export type EditPaymentOptionProps = {
  payment: PaymentWithMetadata;
  clients: Cliente[];
};

export const EditPaymentOption = ({
  payment,
  clients,
}: EditPaymentOptionProps) => {
  const [trigger, dialog] = useFormDialog({
    title: "Editar pago",
    trigger: (
      <DropdownMenuItem>
        <LucidePencil className="h-4 w-4" />
        <span>Editar</span>
      </DropdownMenuItem>
    ),
    form: <PaymentUpsertForm payment={payment} clients={clients} />,
  });

  return (
    <>
      {dialog}
      {trigger}
    </>
  );
};
