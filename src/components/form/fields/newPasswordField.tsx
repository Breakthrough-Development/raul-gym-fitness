import type { ActionState } from "@/types/action-state";
import { DynamicPasswordField } from "./dynamic-fields/DynamicPasswordField";
type NewPasswordFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
};
export const NewPasswordField = ({
  actionState,
  isOptional = false,
}: NewPasswordFieldProps) => {
  return (
    <DynamicPasswordField
      actionState={actionState}
      name="newPassword"
      autoComplete="new-password"
      defaultValue={actionState.payload?.get("newPassword") as string}
      placeholder="Nueva contraseña"
      label="Nueva contraseña"
      isOptional={isOptional}
      data-testid="new-password"
    />
  );
};

