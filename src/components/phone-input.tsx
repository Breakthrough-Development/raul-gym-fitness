"use client";
import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { ActionState } from "./form/util/to-action-state";
export type PhoneInputProps = {
  actionState: ActionState;
  defaultValue?: string;
  name: string;
  label?: string;
  placeholder?: string;
};

function formatPhone(value: string): string {
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

export const PhoneInput = ({
  actionState,
  defaultValue,
  name,
  label,
  placeholder = "(123) 456-7890",
}: PhoneInputProps) => {
  const phoneDefaultValue = () => {
    const payloadValue = actionState.payload?.get(name) as string | undefined;
    if (payloadValue && payloadValue.length > 0) return payloadValue;
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
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        inputMode="tel"
        autoComplete="tel"
        placeholder={placeholder}
        value={value.slice(0, 14)} // Limit to 10 digits by truncating formatted string
        maxLength={14} // Max length of formatted string "(XXX) XXX-XXXX"
        onChange={onChange}
      />
      <FieldError actionState={actionState} name={name} />
    </>
  );
};

export { formatPhone };
