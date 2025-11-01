import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import { ActionState } from "../util/to-action-state";
export type PasswordFieldProps = {
  actionState: ActionState;
};
export const PasswordField = ({ actionState }: PasswordFieldProps) => {
  return (
    <>
      <Label htmlFor="password" className="text-base md:text-lg">
        Contraseña
      </Label>
      <PasswordInput
        id="password"
        name="password"
        placeholder="Contraseña"
        defaultValue={actionState.payload?.get("password") as string}
        autoComplete="current-password"
      />
      <FieldError actionState={actionState} name="password" />
    </>
  );
};
