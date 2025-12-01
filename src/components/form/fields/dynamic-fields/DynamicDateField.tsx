import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { FieldError } from "../../field-error";
import type { ActionState } from "@/types/action-state";

type DynamicDateFieldProps = {
  actionState: ActionState;
  name: string;
  label: string;
  isOptional?: boolean;
  defaultValue?: string;
  "data-testid": string;
};

export const DynamicDateField = ({
  actionState,
  name,
  label,
  isOptional = false,
  defaultValue,
  "data-testid": dataTestId,
}: DynamicDateFieldProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <Label
        htmlFor={name}
        className="text-base md:text-lg"
        data-testid={`${dataTestId}-label`}
      >
        {label} {isOptional ? "(opcional)" : ""}
      </Label>
      <DatePicker id={name} name={name} defaultValue={defaultValue} />
      <FieldError
        actionState={actionState}
        name={name}
        data-testid={`${dataTestId}-error`}
      />
    </div>
  );
};
