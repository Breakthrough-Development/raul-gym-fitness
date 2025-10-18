"use client";

import { useFormDialog } from "@/components/form-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { Client } from "@prisma/client";
import { LucidePencil } from "lucide-react";

export type EditClientOptionProps = {
  client: Client;
};

export const EditClientOption = ({ client }: EditClientOptionProps) => {
  const [trigger, dialog] = useFormDialog({
    title: "Edit client",
    trigger: (
      <DropdownMenuItem>
        <LucidePencil className="h-4 w-4" />
        <span>Edit</span>
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
