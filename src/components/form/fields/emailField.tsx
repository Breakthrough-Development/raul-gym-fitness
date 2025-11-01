"use client";

import { FieldError } from "@/components/form/field-error";
import { ActionState } from "@/components/form/util/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EmailFieldProps = {
  actionState: ActionState;
  isOptional?: boolean;
};
export const EmailField = ({
  actionState,
  isOptional = false,
}: EmailFieldProps) => {
  return (
    <>
      <Label htmlFor="email" className="text-base md:text-lg">
        Correo electrónico {isOptional ? "(opcional)" : ""}
      </Label>
      <Input
        id="email"
        name="email"
        placeholder="Correo electrónico"
        defaultValue={actionState.payload?.get("email") as string}
        className="text-base md:text-lg"
      />
      <FieldError actionState={actionState} name="email" />
    </>
  );
};
