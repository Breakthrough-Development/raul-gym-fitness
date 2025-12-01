"use client";
import type { ActionState } from "@/types/action-state";
import { DynamicPhoneField } from "./dynamic-fields/DynamicPhoneField";
type PhoneInputProps = {
  actionState: ActionState;
  defaultValue?: string;
  isOptional?: boolean;
  disabled?: boolean;
};

export const PhoneField = ({
  actionState,
  defaultValue,
  isOptional = false,
  disabled = false,
}: PhoneInputProps) => {
  return (
    <DynamicPhoneField
      actionState={actionState}
      defaultValue={defaultValue}
      isOptional={isOptional}
      name="phone"
      disabled={disabled}
      data-testid="phone"
    />
  );
};
