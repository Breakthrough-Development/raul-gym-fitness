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
};
export const DynamicPasswordField = ({
  actionState,
  name,
  autoComplete,
  defaultValue,
  placeholder,
  label,
  isOptional = false,
}: PasswordFieldProps) => {
  return (
    <>
      <Label htmlFor={name} className="text-base md:text-lg">
        {label} {isOptional ? "(opcional)" : ""}
      </Label>
      <PasswordInput
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
      />
      <FieldError actionState={actionState} name={name} />
    </>
  );
};
