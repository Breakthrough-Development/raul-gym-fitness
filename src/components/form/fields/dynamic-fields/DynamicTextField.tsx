import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../../field-error";
import type { ActionState } from "@/types/action-state";

type DynamicTextFieldProps = {
  actionState: ActionState;
  name: string;
  placeholder: string;
  label: string;
  isOptional?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  "data-testid": string;
};
export const DynamicTextField = ({
  actionState,
  name,
  placeholder,
  label,
  isOptional = false,
  onChange,
  value,
  "data-testid": dataTestId,
}: DynamicTextFieldProps) => {
  return (
    <>
      <Label htmlFor={name} className="text-base md:text-lg" data-testid={`${dataTestId}-label`}>
        {label} {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="text-base md:text-lg"
        data-testid={`${dataTestId}-input`}
      />
      <FieldError actionState={actionState} name={name} data-testid={`${dataTestId}-error`} />
    </>
  );
};
