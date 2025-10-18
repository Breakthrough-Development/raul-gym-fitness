"use client";

import { useFormDialog } from "@/components/form-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PaymentUpsertForm } from "@/features/payments/components/payment-upsert-form";
import { PaymentWithMetadata } from "@/features/payments/types";
import { Client } from "@prisma/client";
import { LucidePencil } from "lucide-react";

export type EditPaymentOptionProps = {
  payment: PaymentWithMetadata;
  clients: Client[];
};

export const EditPaymentOption = ({
  payment,
  clients,
}: EditPaymentOptionProps) => {
  const [trigger, dialog] = useFormDialog({
    title: "Edit payment",
    trigger: (
      <DropdownMenuItem>
        <LucidePencil className="h-4 w-4" />
        <span>Edit</span>
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
