"use client";

import { useFormDialog } from "@/components/form-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { Client } from "@prisma/client";
import { LucidePencil } from "lucide-react";

type EditClientOptionProps = {
  client: Client;
};

export const EditClientOption = ({ client }: EditClientOptionProps) => {
  const [trigger, dialog] = useFormDialog({
    title: "Editar cliente",
    trigger: (
      <DropdownMenuItem>
        <LucidePencil className="h-4 w-4" />
        <span>Editar</span>
      </DropdownMenuItem>
    ),
    form: <ClientUpsertForm client={client} />,
  });

  return (
    <>
      {dialog}
      {trigger}
    </>
  );
};
