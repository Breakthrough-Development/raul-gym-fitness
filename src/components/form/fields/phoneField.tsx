"use client";
import { ActionState } from "../util/to-action-state";
import { DynamicPhoneField } from "./dynamic-fields/DynamicPhoneField";
export type PhoneInputProps = {
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
    />
  );
};
