"use client";
import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import type { ActionState } from "@/types/action-state";
type PhoneInputProps = {
  actionState: ActionState;
  defaultValue?: string;
  isOptional?: boolean;
  name: string;
  disabled?: boolean;
  "data-testid": string;
};

function formatPhone(value: string | null | undefined): string {
  if (!value) return ""; // Handle null/undefined
  const digits = value.replace(/\D/g, "");
  // Format as (XXX) XXX-XXXX for up to 10 digits; if more, append the rest
  const area = digits.slice(0, 3);
  const mid = digits.slice(3, 6);
  const last = digits.slice(6, 10);
  const extra = digits.slice(10);
  let formatted = digits;
  if (digits.length <= 3) {
    formatted = area;
  } else if (digits.length <= 6) {
    formatted = `(${area}) ${mid}`;
  } else {
    formatted = `(${area}) ${mid}-${last}`;
  }
  return extra ? `${formatted} ${extra}` : formatted;
}

export const DynamicPhoneField = ({
  actionState,
  defaultValue,
  isOptional = false,
  name,
  disabled = false,
  "data-testid": dataTestId,
}: PhoneInputProps) => {
  const phoneDefaultValue = () => {
    const payloadValue = actionState.payload?.get(name) as string | undefined;
    if (payloadValue && payloadValue.length > 0) {
      return payloadValue;
    }
    if (defaultValue !== undefined) return defaultValue;
    return "";
  };

  const [value, setValue] = React.useState<string>(
    formatPhone(phoneDefaultValue())
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(formatPhone(next));
  };

  return (
    <>
      <Label htmlFor={name} className="text-base md:text-lg" data-testid={`${dataTestId}-label`}>
        Teléfono {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id={name}
        name={name}
        inputMode="tel"
        autoComplete="tel"
        placeholder="(123) 456-7890"
        value={value.slice(0, 15)} // Limit to 10 digits by truncating formatted string
        maxLength={15} // Max length of formatted string "(XXX) XXX-XXXX"
        onChange={onChange}
        className="text-base md:text-lg"
        disabled={disabled}
        data-testid={`${dataTestId}-input`}
      />
      <FieldError actionState={actionState} name={name} data-testid={`${dataTestId}-error`} />
    </>
  );
};

export { formatPhone };
