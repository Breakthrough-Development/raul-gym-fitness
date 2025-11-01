import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../../field-error";
import { ActionState } from "../../util/to-action-state";

export type DynamicTextFieldProps = {
  actionState: ActionState;
  name: string;
  placeholder: string;
  label: string;
  isOptional?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};
export const DynamicTextField = ({
  actionState,
  name,
  placeholder,
  label,
  isOptional = false,
  onChange,
  value,
}: DynamicTextFieldProps) => {
  return (
    <>
      <Label htmlFor={name} className="text-base md:text-lg">
        {label} {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name={name} />
    </>
  );
};
