import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import type { ActionState } from "@/types/action-state";

type FirstNameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
  disabled?: boolean;
};
export const FirstNameField = ({
  actionState,
  isOptional = false,
  defaultValue,
  disabled = false,
}: FirstNameFieldProps) => {
  return (
    <>
      <Label
        htmlFor="firstName"
        className="text-base md:text-lg"
        data-testid="first-name-label"
      >
        Primer nombre {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="firstName"
        name="firstName"
        placeholder="Primer nombre"
        defaultValue={
          (actionState.payload?.get("firstName") as string) || defaultValue
        }
        className="text-base md:text-lg"
        disabled={disabled}
        data-testid="first-name-input"
      />
      <FieldError
        actionState={actionState}
        name="firstName"
        data-testid="first-name-error"
      />
    </>
  );
};
