import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../field-error";
import type { ActionState } from "@/types/action-state";

type LastNameFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  defaultValue?: string;
  disabled?: boolean;
};
export const LastNameField = ({
  actionState,
  isOptional = false,
  defaultValue,
  disabled = false,
}: LastNameFieldProps) => {
  return (
    <>
      <Label
        htmlFor="lastName"
        className="text-base md:text-lg"
        data-testid="last-name-label"
      >
        Apellido {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Apellido"
        defaultValue={
          (actionState.payload?.get("lastName") as string) || defaultValue
        }
        className="text-base md:text-lg"
        disabled={disabled}
        data-testid="last-name-input"
      />
      <FieldError
        actionState={actionState}
        name="lastName"
        data-testid="last-name-error"
      />
    </>
  );
};
