"use client";

import { FieldError } from "@/components/form/field-error";
import { ActionState } from "@/components/form/util/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EmailFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
  disabled?: boolean;
  defaultValue?: string;
};
export const EmailField = ({
  actionState,
  isOptional = false,
  disabled = false,
  defaultValue,
}: EmailFieldProps) => {
  return (
    <>
      <Label htmlFor="email" className="text-base md:text-lg" data-testid="email-label">
        Correo electrónico {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="email"
        name="email"
        placeholder="Correo electrónico"
        defaultValue={
          (actionState.payload?.get("email") as string) || defaultValue
        }
        className="text-base md:text-lg"
        disabled={disabled}
        data-testid="email-input"
      />
      <FieldError actionState={actionState} name="email" data-testid="email-error" />
    </>
  );
};
