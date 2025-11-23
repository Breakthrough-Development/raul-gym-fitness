import { useConfirmDialog } from "@/components/confirm-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideTrash } from "lucide-react";
import { ActionState } from "./form/util/to-action-state";

export type DeleteOptionProps = {
  id: string;
  action: (id: string) => Promise<ActionState>;
  onSuccess?: (actionState: ActionState) => void;
};
export const DeleteOption = ({ id, action, onSuccess }: DeleteOptionProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: action.bind(null, id),
    onSuccess,
    trigger: (
      <DropdownMenuItem data-testid="notification-delete-option">
        <LucideTrash className="h-4 w-4" />
        <span>Eliminar</span>
      </DropdownMenuItem>
    ),
  });
  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};
