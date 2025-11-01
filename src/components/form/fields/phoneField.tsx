"use client";
import { ActionState } from "../util/to-action-state";
import { DynamicPhoneField } from "./dynamic-fields/DynamicPhoneField";
export type PhoneInputProps = {
  actionState: ActionState;
  defaultValue?: string;
  isOptional?: boolean;
};

export const PhoneField = ({
  actionState,
  defaultValue,
  isOptional = false,
}: PhoneInputProps) => {
  return (
    <DynamicPhoneField
      actionState={actionState}
      defaultValue={defaultValue}
      isOptional={isOptional}
      name="phone"
    />
  );
};
