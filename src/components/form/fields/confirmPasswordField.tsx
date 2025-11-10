import { ActionState } from "../util/to-action-state";
import { DynamicPasswordField } from "./dynamic-fields/DynamicPasswordField";
export type ConfirmPasswordFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
};
export const ConfirmPasswordField = ({
  actionState,
  isOptional = false,
}: ConfirmPasswordFieldProps) => {
  return (
    <DynamicPasswordField
      actionState={actionState}
      name="confirmPassword"
      autoComplete="new-password"
      defaultValue={actionState.payload?.get("confirmPassword") as string}
      placeholder="Confirmar contraseña"
      label="Confirmar contraseña"
      isOptional={isOptional}
      data-testid="confirm-password"
    />
  );
};
