import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../../field-error";
import { ActionState } from "../../util/to-action-state";
export type PasswordFieldProps = {
  actionState: ActionState;
  name: string;
  autoComplete: "current-password" | "new-password";
  defaultValue: string;
  placeholder: string;
  label: string;
  isOptional?: boolean;
  "data-testid": string;
};
export const DynamicPasswordField = ({
  actionState,
  name,
  autoComplete,
  defaultValue,
  placeholder,
  label,
  isOptional = false,
  "data-testid": dataTestId,
}: PasswordFieldProps) => {
  return (
    <>
      <Label
        htmlFor={name}
        className="text-base md:text-lg"
        data-testid={`${dataTestId}-label`}
      >
        {label} {isOptional ? "(opcional)" : ""}
      </Label>
      <PasswordInput
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        data-testid={`${dataTestId}-input`}
      />
      <FieldError
        actionState={actionState}
        name={name}
        data-testid={`${dataTestId}-error`}
      />
    </>
  );
};
