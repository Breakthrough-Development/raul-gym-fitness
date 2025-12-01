"use client";
import type { ActionState } from "@/types/action-state";
import { DynamicPhoneField } from "./dynamic-fields/DynamicPhoneField";
type PhoneInputProps = {
  actionState: ActionState;
  defaultValue?: string;
  isOptional?: boolean;
};

export const ConfirmPhoneField = ({
  actionState,
  defaultValue,
  isOptional = false,
}: PhoneInputProps) => {
  return (
    <DynamicPhoneField
      actionState={actionState}
      defaultValue={defaultValue}
      isOptional={isOptional}
      name="confirmPhone"
      data-testid="confirm-phone"
    />
  );
};
