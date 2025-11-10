import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import { ActionState } from "../util/to-action-state";

export type UsernameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
  disabled?: boolean;
};
export const UsernameField = ({
  actionState,
  isOptional = false,
  defaultValue,
  disabled = false,
}: UsernameFieldProps) => {
  return (
    <>
      <Label htmlFor="username" className="text-base md:text-lg" data-testid="username-label">
        Nombre de usuario {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="username"
        name="username"
        placeholder="Nombre de usuario"
        defaultValue={
          (actionState.payload?.get("username") as string) || defaultValue
        }
        className="text-base md:text-lg"
        disabled={disabled}
        data-testid="username-input"
      />
      <FieldError actionState={actionState} name="username" data-testid="username-error" />
    </>
  );
};
