"use client";
import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState } from "./form/util/to-action-state";
export type CurrencyInputProps = {
  actionState: ActionState;
  defaultValue?: number;
  name: string;
};

export const CurrencyInput = ({
  actionState,
  defaultValue,
  name,
}: CurrencyInputProps) => {
  const amountDefaultValue = () => {
    if (actionState.payload?.get(name) as string) {
      return actionState.payload?.get(name) as string;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return "";
  };

  return (
    <>
      <Label htmlFor={name}>Amount</Label>
      <Input
        id={name}
        name={name}
        type="decimal"
        inputMode="decimal"
        defaultValue={amountDefaultValue()}
      />
      <FieldError actionState={actionState} name={name} />
    </>
  );
};
