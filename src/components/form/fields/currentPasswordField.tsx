import type { ActionState } from "@/types/action-state";
import { DynamicPasswordField } from "./dynamic-fields/DynamicPasswordField";
type CurrentPasswordFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
};
export const CurrentPasswordField = ({
  actionState,
  isOptional = false,
}: CurrentPasswordFieldProps) => {
  return (
    <DynamicPasswordField
      actionState={actionState}
      name="currentPassword"
      autoComplete="current-password"
      defaultValue={actionState.payload?.get("currentPassword") as string}
      placeholder="Contraseña actual"
      label="Contraseña actual"
      isOptional={isOptional}
      data-testid="current-password"
    />
  );
};

