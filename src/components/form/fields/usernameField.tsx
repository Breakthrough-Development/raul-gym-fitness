import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import { ActionState } from "../util/to-action-state";

export type UsernameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
};
export const UsernameField = ({
  actionState,
  isOptional = false,
  defaultValue,
}: UsernameFieldProps) => {
  return (
    <>
      <Label htmlFor="username" className="text-base md:text-lg">
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
      />
      <FieldError actionState={actionState} name="username" />
    </>
  );
};
