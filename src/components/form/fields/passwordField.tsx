import type { ActionState } from "@/types/action-state";
import { DynamicPasswordField } from "./dynamic-fields/DynamicPasswordField";
type PasswordFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
};
export const PasswordField = ({
  actionState,
  isOptional = false,
}: PasswordFieldProps) => {
  return (
    <DynamicPasswordField
      actionState={actionState}
      name="password"
      autoComplete="current-password"
      defaultValue={actionState.payload?.get("password") as string}
      placeholder="Contraseña"
      label="Contraseña"
      isOptional={isOptional}
      data-testid="password"
    />
  );
};
