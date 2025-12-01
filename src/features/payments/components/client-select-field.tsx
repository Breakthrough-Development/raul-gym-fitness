"use client";
import { FieldError } from "@/components/form/field-error";
import { SearchableSelect } from "@/components/search-select/search-select";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/types/action-state";
import { Client } from "@prisma/client";
import { Pencil, Plus, Trash2 } from "lucide-react";

type ClientSelectFieldProps = {
  actionState: ActionState;
  clientList: Client[];
  selectedClientId: string | undefined;
  onValueChange: (value: string | undefined) => void;
  onNewClientClick: () => void;
  onOptionMenuAction: (clientId: string, actionId: string) => void;
};

export const ClientSelectField = ({
  actionState,
  clientList,
  selectedClientId,
  onValueChange,
  onNewClientClick,
  onOptionMenuAction,
}: ClientSelectFieldProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor="clientId" className="text-base md:text-lg">
        Cliente
      </Label>
      <SearchableSelect
        value={selectedClientId}
        name="clientId"
        options={clientList.map((client) => ({
          value: client.id,
          label: client.firstName + " " + client.lastName,
        }))}
        actionItems={[
          {
            id: "new-client",
            label: "Nuevo Cliente",
            icon: <Plus className="h-4 w-4" />,
          },
        ]}
        onActionItemClick={onNewClientClick}
        onValueChange={onValueChange}
        showOptionsMenu={true}
        optionMenuItems={[
          {
            id: "edit",
            label: "Editar",
            icon: <Pencil className="h-4 w-4 mr-2" />,
          },
          {
            id: "delete",
            label: "Eliminar",
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            variant: "destructive",
          },
        ]}
        onOptionMenuAction={onOptionMenuAction}
      />
      <FieldError actionState={actionState} name="clientId" />
    </div>
  );
};
